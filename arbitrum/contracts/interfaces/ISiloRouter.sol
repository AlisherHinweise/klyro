// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.13;

import "./ISilo.sol";
import "./IERC20.sol";

interface ISiloRepository {
    enum ActionType { Deposit, Withdraw, Borrow, Repay }
    
    struct Action {
        // what do you want to do?
        ActionType actionType;
        // which Silo are you interacting with?
        ISilo silo;
        // what asset do you want to use?
        IERC20 asset;
        // how much asset do you want to use?
        uint256 amount;
        // is it an action on collateral only?
        bool collateralOnly;
    }

    function execute(Action[] calldata _actions) external payable;
}