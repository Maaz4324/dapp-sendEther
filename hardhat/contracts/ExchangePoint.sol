//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract ExchangePoint {
    function transfer(address payable to) external payable {
        to.transfer(msg.value);
    }

    function getUserBalance(address user) external view returns (uint256) {
        return user.balance;
    }
}
