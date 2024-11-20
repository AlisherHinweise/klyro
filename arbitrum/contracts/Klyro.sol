// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;
pragma abicoder v2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import "./interfaces/IWrappedNativeToken.sol";
import "./interfaces/ISiloRepository.sol";

contract Klyro is Ownable, ReentrancyGuard, Pausable {
    ISiloRepository public immutable siloRepository;
    ISwapRouter public immutable swapRouter;

    uint8 public constant MAX_LEVERAGE = 3;
    uint256 public constant MIN_DEPOSIT = 0.01 ether;
    uint24 public constant POOL_FEE = 3000;
    uint8 public constant MAX_LTV = 74;
    IERC20 public constant USDC = IERC20(0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8);
    ISilo public constant SILO_POOL = ISilo(0x7bec832FF8060cD396645Ccd51E9E9B0E5d8c6e4);
    IWrappedNativeToken public constant WETH = IWrappedNativeToken(0x82aF49447D8a07e3bd95BD0d56f35241523fBab1);


    struct Position {
        uint256 depositedAmount;
        uint256 borrowedAmount;
        uint8 leverage,
        uint256 liquidationPrice;
    }

    mapping(address => Position[]) positions;

    event PositionOpened(
        address indexed user,
        uint256 depositedAmount,
        uint8 leverage,
        uint256 liquidationPrice
    );
    event PositionClosed(
        address indexed user,
        uint256 withdrawnAmount,
        uint256 earnedAmount,
    );

    error InvalidLeverage();
    error InsufficientDeposit();
    error NoPositionFound();
    error UnauthorizedAccess();

    constructor(ISiloRepository _siloRepository, ISwapRouter _swapRouter) Ownable(msg.sender) {
        siloRepository = _siloRepository;
        swapRouter = _swapRouter;
    }

    receive() external payable {
        openPosition(1);
    }

    modifier sufficientDeposit() {
        if (msg.value < MIN_DEPOSIT) {
            revert InsufficientDeposit();
        }
        _;
    }

    modifier hasPosition(uint256 _index) {
        if (postions[msg.sender].length >= _index + 1) {
            revert NoPositionFound();
        }
        _;
    }

    function getPosition(address user) internal view returns (Position memory) {
        return positions[user];
    }

    function openPosition(uint8 _leverage) external payable nonReentrant whenNotPaused sufficientDeposit {
        if (_leverage == 0 || _leverage > MAX_LEVERAGE) {
            revert InvalidLeverage();
        }

        uint256 liquidationPrice = calculateLiquidationPrice(msg.value, _leverage); // need to be done
        uint256 totalDeposited = msg.value;
        uint256 currentDeposit = msg.value;

        WETH.deposit{value: msg.value}();
        TransferHelper.safeApprove(address(WETH), address(siloRepository), msg.value);

        // execute deposit on Silo
        ISiloRepository.Action[] memory firstAction = new ISiloRepository.Action[](1);
        actions[0] = ISiloRepository.Action({
            actionType: ISiloRepository.ActionType.Deposit,
            silo: SILO_POOL,
            asset: WETH,
            amount: msg.value,
            collateralOnly: false
        });

        siloRepository.execute(firstAction);

        for (uint256 i = 1; i < _leverage; i++) {
            //borrow USDC
            uint256 borrowAmount = maxAvailableForBorrow(currentDeposit);

            ISiloRepository.Action[] memory borrowAction = new ISiloRepository.Action[](1);
            borrowAction[0] = ISiloRepository.Action({
                actionType: ISiloRepository.ActionType.Borrow,
                silo: SILO_POOL,
                asset: USDC,
                amount: borrowAmount,
                collateralOnly: false
            });
            siloRepository.execute(borrowAction);

            //perform swap from USDC.e back to ETH to continue looping
            uint256 ethReceived = swapExactInputSingle(borrowAmount);

            WETH.deposit{value: ethReceived}();
            TransferHelper.safeApprove(address(WETH), address(siloRepository), ethReceived);

            ISiloRepository.Action[] memory depositAction = new ISiloRepository.Action[](1);
            depositAction[0] = ISiloRepository.Action({
                actionType: ISiloRepository.ActionType.Deposit,
                silo: SILO_POOL,
                asset: WETH,
                amount: ethReceived,
                collateralOnly: false
            });
            siloRepository.execute(depositAction);

            currentDeposit = ethReceived;
            totalDeposited += ethReceived;
        }

        // adding info about user's position to database
        positions[msg.sender].push(Position({
            depositedAmount: msg.value;
            borrowedAmount: totalDeposited - msg.value; //is it even needed? borrow should't be an option for user
            leverage: _leverage;
            liquidationPrice: liquidationPrice;
        }));

        emit PositionOpened(msg.sender, msg.value, _leverage, liquidationPrice);
    }

    function closePosition(uint256 _index) external nonReentrant whenNotPaused hasPosition(_index) {
        Position storage position = positions[msg.sender][_index];

        uint8 leverage = position.leverage;
        uint256 totalDeposited = position.depositedAmount;
        uint256 currentDeposit = totalDeposited;
        
        // reset user data
        delete positions[msg.sender][positionIndex];

        // execute withdrawal from Silo
        for (uint256 i = leverage - 1; i > 0; i--) {
            uint256 withdrawAmount = maxAvailableForWithdraw(currentDeposit); // need to be done

            ISiloRepository.Action[] memory withdrawAction = new ISiloRepository.Action[](1);
            withdrawAction[0] = ISiloRepository.Action({
                actionType: ISiloRepository.ActionType.Withdraw,
                silo: SILO_POOL,
                asset: WETH,
                amount: withdrawAmount,
                collateralOnly: false
            });
            siloRepository.execute(withdrawAction);

            WETH.withdraw(withdrawAmount);

            uint256 usdcReceived = swapExactInputSingle(withdrawAmount);

            ISiloRepository.Action[] memory repayAction = new ISiloRepository.Action[](1);
            repayAction[0] = ISiloRepository.Action({
                actionType: ISiloRepository.ActionType.Repay,
                silo: SILO_POOL,
                asset: USDC,
                amount: usdcReceived,
                collateralOnly: false
            });
            siloRepository.execute(repayAction);

            currentDeposit -= withdrawAmount;
        }

        uint256 finalWithdrawAmount = maxAvailableForWithdraw(currentDeposit);
    
        ISiloRepository.Action[] memory finalWithdrawAction = new ISiloRepository.Action[](1);
        finalWithdrawAction[0] = ISiloRepository.Action({
            actionType: ISiloRepository.ActionType.Withdraw,
            silo: SILO_POOL,
            asset: WETH,
            amount: finalWithdrawAmount,
            collateralOnly: false
        });
        siloRepository.execute(finalWithdrawAction);

        WETH.withdraw(finalWithdrawAmount);
        payable(msg.sender).transfer(finalWithdrawAmount);

        uint256 earnedAmount = calculateProfit(user); // need to be done

        emit PositionClosed(msg.sender, totalDeposited, earnedAmount);
    }

    function maxAvailableForBorrow(uint256 collateralAmount) internal pure returns (uint256) {
        return (collateralAmount * MAX_LTV) / 100;
    }

    // need to use an oracle. no oracle for now
    function swapExactInputSingle(uint256 amountIn) external returns (uint256 amountOut) {
        // Transfer the specified amount of USDC to this contract.
        TransferHelper.safeTransferFrom(address(USDC), msg.sender, address(this), amountIn);

        // Approve the router to spend USDC.
        TransferHelper.safeApprove(address(USDC), address(swapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: address(USDC),
                tokenOut: address(WETH),
                fee: POOL_FEE,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}

