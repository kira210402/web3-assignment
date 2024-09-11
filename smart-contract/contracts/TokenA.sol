// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenA is ERC20 {
    uint256 public cap = 50_000_000_000 * 10 ** uint256(18);

    constructor() ERC20("TokenA", "TKA") {
        _mint(msg.sender, cap);
    }

    function mint(uint256 _amount) public {
        _mint(msg.sender, _amount);
    }
}
