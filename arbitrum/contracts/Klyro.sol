// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./interfaces/IWrappedNativeToken.sol";
import "./interfaces/ISiloRepository.sol";

contract Klyro is Ownable {
    IWrappedNativeToken public immutable wrappedNativeToken;
    ISiloRepository public immutable siloRepository;

    uint8 public constant MAX_LEVERAGE = 3;
    uint256 public constant MIN_DEPOSIT = 0.01 ether;

    struct UserPosition {
        uint256 depositedAmount;
        uint256 borrowedAmount;
        uint8 leverage,
        uint256 liquidationPrice;
    }

    mapping(address => UserPosition[]) userDatabase;

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
    error NoPositionExists();
    error UnauthorizedAccess();

    constructor(IWrappedNativeToken _wrappedNativeToken, ISiloRepository _siloRepository) Ownable(msg.sender) {
        wrappedNativeToken = _wrappedNativeToken;
        siloRepository = _siloRepository;
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
        if (userDatabase[msg.sender].length >= _index) {
            revert NoPositionExists();
        }
        _;
    }

    function openPosition(uint8 _leverage) external payable nonReentrant whenNotPaused sufficientDeposit {
        if (_leverage == 0 || _leverage > MAX_LEVERAGE) {
            revert InvalidLeverage();
        }

        uint256 liquidationPrice = calculateLiquidationPrice(msg.value, _leverage); // need to be done

        // adding info about user's position to database
        userDatebase[msg.sender].push(UserPosition({
            depositedAmount: msg.value;
            borrowedAmount: availableForBorrow(msg.value); //implement availableForBorrow function, parameter
            leverage: _leverage;
            liquidationPrice: liquidationPrice;
        }));

        // execute deposit on Silo
        ISiloRepository.Action[] memory actions = new ISiloRepository.Action[](2); //change array's length to leverage // no leverage implemented for now
        actions[0] = ISiloRepository.Action({
            actionType: ISiloRepository.ActionType.Deposit,
            silo: ISilo(0x7bec832FF8060cD396645Ccd51E9E9B0E5d8c6e4),
            asset: IERC20(0x82aF49447D8a07e3bd95BD0d56f35241523fBab1), //WETH contract
            amount: msg.value,
            collateralOnly: false
        });
        actions[1] = ISiloRepository.Action({
            actionType: ISiloRepository.ActionType.Borrow,
            silo: ISilo(0x7bec832FF8060cD396645Ccd51E9E9B0E5d8c6e4),
            asset: IERC20(0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8), //USDC contract
            amount: maxAvailableForBorrow(msg.value),
            collateralOnly: false
        });

        //perform swap from USDC back to ETH to loop
        
        siloRepository.execute(actions);

        emit PositionOpened(msg.sender, msg.value, _leverage, liquidationPrice);
    }

    function closePosition(uint256 _index) external nonReentrant whenNotPaused hasPosition(_index) {
        // reset user data
        delete userDatabase[msg.sender][_index];

        // execute withdrawal from Silo
        ISiloRepository.Action[] memory actions = new ISiloRepository.Action[](1);
        actions[0] = ISiloRepository.Action({
            actionType: ISiloRepository.ActionType.Withdraw,
            silo: ISilo(0x7bec832FF8060cD396645Ccd51E9E9B0E5d8c6e4),
            asset: IERC20(0x82aF49447D8a07e3bd95BD0d56f35241523fBab1),
            amount: user.depositedAmount + user.borrowedAmount,
            collateralOnly: false
        });

        siloRepository.execute(actions);

        uint256 earnedAmount = calculateProfit(user); // need to be done

        emit PositionClosed(msg.sender, user.depositedAmount, earnedAmount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}

