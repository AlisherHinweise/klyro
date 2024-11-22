// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./PositionManager.sol";

/// @title Klyro basic contract
/// @author https://github.com/cunnily
/// @notice Protocol built on top of Silo for earning interest with delta-neutral strategy
contract Klyro is Ownable, Pausable {
    uint8 public maxLeverage;
    uint256 public minDeposit;
    uint24 public poolFee;

    mapping(address => PositionManager[]) positions;

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

    constructor() Ownable(msg.sender) {
        maxLeverage = 3;
        minDeposit = 0.01 ether;
        poolFee = 3000;
    }

    receive() external payable {
        openPosition(1){value: msg.value};
    }

    modifier sufficientDeposit() {
        if (msg.value < minDeposit) {
            revert InsufficientDeposit();
        }
        _;
    }

    modifier hasPosition(uint256 _index) {
        if (postions[msg.sender].length < _index + 1) {
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

    function setPoolFee(uint24 _fee) external onlyOwner {
        poolFee = _fee;
    }

    function getCollateralValueByUser(address _user, uint256 _index) external view returns (uint256) {
        return positions[_user][_index].getCollateralValue();
    }

    function getBorrowValueByUser(address _user, uint256 _index) external view returns (uint256) {
        return positions[_user][_index].getBorrowValue();
    }

    function getPositionLTVByUser(address _user, uint256 _index) external view returns (uint256) {
        return positions[_user][_index].getPositionLTV();
    }

    function openPosition(uint8 _leverage) external payable whenNotPaused sufficientDeposit {
        if (_leverage == 0 || _leverage > maxLeverage) {
            revert InvalidLeverage();
        }

        PositionManager position = new PositionManager(msg.sender, poolFee);
        positions[msg.sender].push(position);
        (bool success, ) = address(position).call{value: msg.value}(abi.encodeWithSignature("openPosition(uint8)", _leverage));
        require(success, "Transaction failed");

        emit PositionOpened(msg.sender, msg.value, _leverage, liquidationPrice);
    }

    function closePosition(uint256 _index) external whenNotPaused hasPosition(_index) {
        PositionManager memory position = positions[msg.sender][_index];

        // reset user data
        delete positions[msg.sender][_index];

        position.closePosition(_index);

        uint256 earnedAmount = calculateProfit(position); /// need to be done
        uint256 totalDeposited = position.Position.depositedAmount;

        emit PositionClosed(msg.sender, totalDeposited, earnedAmount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}

