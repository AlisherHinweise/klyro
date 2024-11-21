// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;
pragma abicoder v2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import "./interfaces/IWrappedNativeToken.sol";
import "./interfaces/ISiloRouter.sol";
import "./interfaces/ISiloRepository.sol";
import "./interfaces/ISiloLens.sol";

/// @title Klyro basic contract
/// @author https://github.com/cunnily
/// @notice Protocol built on top of Silo for earning interest with delta-neutral strategy
contract Klyro is Ownable, ReentrancyGuard, Pausable {
    ISiloRouter public immutable siloRouter;
    ISiloRepository public immutable siloRepository;
    ISiloLens public immutable siloLens;
    ISwapRouter public immutable swapRouter;

    uint8 public maxLeverage;
    uint256 public minDeposit;

    uint24 public constant POOL_FEE = 3000;
    IERC20 public constant USDC = IERC20(0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8);
    ISilo public constant SILO_POOL = ISilo(0x7bec832FF8060cD396645Ccd51E9E9B0E5d8c6e4);
    IWrappedNativeToken public constant WETH = IWrappedNativeToken(0x82aF49447D8a07e3bd95BD0d56f35241523fBab1);


    struct Position {
        uint256 depositedAmount;
        uint8 leverage;
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

    constructor(ISiloRouter _siloRouter, ISiloRepository _siloRepository, ISiloLens _siloLens, ISwapRouter _swapRouter) Ownable(msg.sender) {
        siloRouter = _siloRouter;
        siloRepository = _siloRepository;
        siloLens = _siloLens;
        swapRouter = _swapRouter;
        maxLeverage = 3;
        minDeposit = 0.01 ether;
    }

    receive() external payable {
        openPosition(1);
    }

    modifier sufficientDeposit() {
        if (msg.value < minDeposit) {
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
    
    function setMaxLeverage(uint256 _leverage) external onlyOwner {
        maxLeverage = _leverage;
    }

    function setMinDeposit(uint256 _deposit) external onlyOwner {
        minDeposit = _deposit;
    }

    function openPosition(uint8 _leverage) external payable nonReentrant whenNotPaused sufficientDeposit {
        if (_leverage == 0 || _leverage > maxLeverage) {
            revert InvalidLeverage();
        }

        uint256 liquidationPrice = calculateLiquidationPrice(msg.value, _leverage); /// need to be done
        uint256 totalDeposited = msg.value;
        uint256 currentDeposit = msg.value;

        WETH.deposit{value: msg.value}();
        TransferHelper.safeApprove(address(WETH), address(siloRouter), msg.value);

        // execute deposit on Silo
        ISiloRouter.Action[] memory firstAction = new ISiloRouter.Action[](1);
        actions[0] = ISiloRouter.Action({
            actionType: ISiloRouter.ActionType.Deposit,
            silo: SILO_POOL,
            asset: WETH,
            amount: msg.value,
            collateralOnly: false
        });

        siloRouter.execute(firstAction);

        for (uint256 i = 1; i < _leverage; i++) {
            //borrow USDC
            uint256 borrowAmount = _maxAvailableForBorrow(currentDeposit);

            ISiloRouter.Action[] memory borrowAction = new ISiloRouter.Action[](1);
            borrowAction[0] = ISiloRouter.Action({
                actionType: ISiloRouter.ActionType.Borrow,
                silo: SILO_POOL,
                asset: USDC,
                amount: borrowAmount,
                collateralOnly: false
            });
            siloRouter.execute(borrowAction);

            //perform swap from USDC.e back to ETH to continue looping
            uint256 ethReceived = _swapExactInputSingle(borrowAmount);

            WETH.deposit{value: ethReceived}();
            TransferHelper.safeApprove(address(WETH), address(siloRouter), ethReceived);

            ISiloRouter.Action[] memory depositAction = new ISiloRouter.Action[](1);
            depositAction[0] = ISiloRouter.Action({
                actionType: ISiloRouter.ActionType.Deposit,
                silo: SILO_POOL,
                asset: WETH,
                amount: ethReceived,
                collateralOnly: false
            });
            siloRouter.execute(depositAction);

            currentDeposit = ethReceived;
            totalDeposited += ethReceived;
        }

        // adding info about user's position to database
        positions[msg.sender].push(Position({
            depositedAmount: msg.value;
            leverage: _leverage;
            liquidationPrice: liquidationPrice;
        }));

        emit PositionOpened(msg.sender, msg.value, _leverage, liquidationPrice);
    }

    /// flashLiquidate method can be used - 0x7bec832FF8060cD396645Ccd51E9E9B0E5d8c6e4
    function closePosition(uint256 _index) external nonReentrant whenNotPaused hasPosition(_index) {
        Position storage position = positions[msg.sender][_index];

        uint8 leverage = position.leverage;
        uint256 totalDeposited = position.depositedAmount;
        uint256 currentDeposit = totalDeposited;
        
        // reset user data
        delete positions[msg.sender][_index];

        ///MaxLTV - currentLTV withdraw => swap ETH-USDC => repay USDC

        // execute withdrawal from Silo
        for (uint256 i = leverage - 1; i > 0; i--) {
            uint256 withdrawAmount = _maxAvailableForWithdraw(currentDeposit); /// need to be done

            ISiloRouter.Action[] memory withdrawAction = new ISiloRouter.Action[](1);
            withdrawAction[0] = ISiloRouter.Action({
                actionType: ISiloRouter.ActionType.Withdraw,
                silo: SILO_POOL,
                asset: WETH,
                amount: withdrawAmount,
                collateralOnly: false
            });
            siloRouter.execute(withdrawAction);

            WETH.withdraw(withdrawAmount);

            uint256 usdcReceived = _swapExactInputSingle(withdrawAmount);

            ISiloRouter.Action[] memory repayAction = new ISiloRouter.Action[](1);
            repayAction[0] = ISiloRouter.Action({
                actionType: ISiloRouter.ActionType.Repay,
                silo: SILO_POOL,
                asset: USDC,
                amount: usdcReceived,
                collateralOnly: false
            });
            siloRouter.execute(repayAction);

            currentDeposit -= withdrawAmount;
        }

        uint256 finalWithdrawAmount = _maxAvailableForWithdraw(currentDeposit);
    
        ISiloRouter.Action[] memory finalWithdrawAction = new ISiloRouter.Action[](1);
        finalWithdrawAction[0] = ISiloRouter.Action({
            actionType: ISiloRouter.ActionType.Withdraw,
            silo: SILO_POOL,
            asset: WETH,
            amount: finalWithdrawAmount,
            collateralOnly: false
        });
        siloRouter.execute(finalWithdrawAction);

        WETH.withdraw(finalWithdrawAmount);
        payable(msg.sender).transfer(finalWithdrawAmount);

        uint256 earnedAmount = calculateProfit(user); /// need to be done

        emit PositionClosed(msg.sender, totalDeposited, earnedAmount);
    }

    function _getMaximumLTV() internal view returns (uint256) {
        return ISiloRepository.getMaximumLTV(address(SILO_POOL), address(WETH)) / 10 ** 16 - 1;
    }

    function _maxAvailableForBorrow(uint256 collateralAmount) internal pure returns (uint256) {
        return (collateralAmount * _getMaximumLTV()) / 100;
    }

    function _maxAvailableForWithdraw() internal returns (uint256) {
        
    }

    /// need to use an oracle. no oracle for now
    function _swapExactInputSingle(uint256 amountIn) internal returns (uint256 amountOut) {
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

