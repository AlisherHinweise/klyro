// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;
pragma abicoder v2;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import "./interfaces/IWrappedNativeToken.sol";
import "./interfaces/ISiloRouter.sol";
import "./interfaces/ISiloRepository.sol";
import "./interfaces/ISiloLens.sol";

contract PositionManager is ReentrancyGuard {
    address public immutable owner;
    address public constant user;
    uint24 public poolFee;
    ISiloRouter public constant siloRouter = ISiloRouter(0x9992f660137979C1ca7f8b119Cd16361594E3681);    
    ISiloRepository public constant siloRepository = ISiloRepository(0x8658047e48CC09161f4152c79155Dac1d710Ff0a);
    ISiloLens public constant siloLens = ISiloLens(0xBDb843c7a7e48Dc543424474d7Aa63b61B5D9536);
    ISwapRouter public constant swapRouter = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    IERC20 public constant USDC = IERC20(0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8);
    ISilo public constant SILO_POOL = ISilo(0x7bec832FF8060cD396645Ccd51E9E9B0E5d8c6e4);
    IWrappedNativeToken public constant WETH = IWrappedNativeToken(0x82aF49447D8a07e3bd95BD0d56f35241523fBab1);

    struct public Position {
        uint256 depositedAmount;
        uint256 timestamp;
        uint8 leverage;
        uint256 liquidationPrice;
    }

    error UnauthorizedAccess();

    constructor(address _user, uint24 _poolFee) {
        owner = msg.sender;
        user = _user;
        poolFee = _poolFee;
    }

    modifier onlyOwner {
        if (owner != msg.sender) {
            revert UnauthorizedAccess();
        }
        _;
    }

    function getCollateralValue() public view returns (uint256) {
        uint256 collateral = ISiloLens.calculateCollateralValue(address(SILO_POOL), user, address(WETH));
        return collateral;
    }

    function getBorrowValue() public view returns (uint256) {
        uint256 collateral = ISiloLens.calculateBorrowValue(address(SILO_POOL), user, address(WETH));
        return collateral;
    }

    function getPositionLTV() public view returns (uint256) {
        uint256 ltv = ISiloLens.getUserLTV(address(SILO_POOL), user) / 10 ** 16;
        return ltv;
    }

    function openPosition(uint8 _leverage) external payable onlyOwner nonReentrant {

        uint256 liquidationPrice = calculateLiquidationPrice(msg.value, _leverage); /// need to be done
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
        }

        // adding info about user's position
        Position({
            depositedAmount: msg.value;
            timestamp: block.timestamp;
            leverage: _leverage;
            liquidationPrice: liquidationPrice;
        });

    }

    function closePosition(uint256 _index) external onlyOwner nonReentrant {
        uint8 leverage = Position.leverage;
        uint256 totalDeposited = Position.depositedAmount;
        uint256 currentDeposit = totalDeposited;

        _getMaximumLTV() - getPositionLTV()

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
}