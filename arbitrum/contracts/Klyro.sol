// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IWrappedNativeToken.sol";
import "./interfaces/ISiloRepository.sol";

contract Klyro is Ownable {
    IWrappedNativeToken public immutable wrappedNativeToken;
    ISiloRepository public immutable siloRepository;
    struct User{
        address userAddress;
        uint256 depositedAmount;
        uint8 leverage;
        uint liquidationPrice;
    }
    mapping(address => User) userDatabase;

    event Deposited(address depositor, uint amount);
    event Withdrawn(address withdrawer, uint amount);

    constructor(IWrappedNativeToken _wrappedNativeToken, ISiloRepository _siloRepository) Ownable(msg.sender) {
        wrappedNativeToken = _wrappedNativeToken;
        siloRepository = _siloRepository;
    }

    function openPosition(uint8 _leverage) external {
        //add if for existing postion
        userDatebase[msg.sender] = User{
            userAddress: msg.sender;
            depositedAmount: msg.value;
            leverage: _leverage;
            liquidationPrice: getLiquidationPrice;
        }
        ISiloRepository.execute();
    }

    function closePosition() external {
        require(userDatabase[msg.sender].userAddress = msg.sender, "You don't have a position")
        //add if for existing postion
        ISiloRepository.execute();
    }
        
}

