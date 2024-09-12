// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenA is ERC20, Ownable {
    uint256 public cap = 50_000_000_000 * 10 ** uint256(18);

    mapping(address => bool) private _approveForTransfer;

    modifier onlyApprovedForTransfer(address from) {
        require(_approveForTransfer[from], "ERC20: Not approved for transfer");
        _;
    }

    constructor() ERC20("TokenA", "TKA") Ownable(msg.sender) {
        _mint(msg.sender, cap);
        approve(address(this), cap);
    }

    function approveForTransfer(address operator) external onlyOwner {
        _approveForTransfer[operator] = true;
    }

    function transferToUser(
        address to,
        uint256 amount
    ) external onlyApprovedForTransfer(msg.sender) {
        _transfer(msg.sender, to, amount);
    }

    function faucet(uint256 _amount) external {
        require(
            _amount <= allowance(owner(), address(this)),
            "TokenA: Not enough allowance"
        );
        this.transferFrom(owner(), msg.sender, _amount);
    }

    function _claimReward(address to, uint256 amount) internal {
        this.transferFrom(owner(), to, amount);
    }

    function claimReward(
        address to,
        uint256 amount
    ) external onlyApprovedForTransfer(msg.sender) {
        _claimReward(to, amount);
    }
}
