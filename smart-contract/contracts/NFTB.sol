// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTB is ERC721 {
    uint256 private _tokenIdCounter;
    mapping(address => uint256[]) private _ownedTokens;

    constructor() ERC721("NFTB", "NFTB") {
        _tokenIdCounter = 0;
    }

    function mint(address _to) public {
        _safeMint(_to, _tokenIdCounter);
        _ownedTokens[_to].push(_tokenIdCounter);
        _tokenIdCounter += 1;
    }

    function getBalanceNFT(address owner) external view returns (uint256) {
        return balanceOf(owner);
    }

    function getOwnedTokens(address owner) public view returns (uint256[] memory) {
        return _ownedTokens[owner];
    }

    function removeOwnedToken(address owner, uint256 tokenId) external {
        uint256[] storage ownedTokens = _ownedTokens[owner];
        for (uint256 i = 0; i < ownedTokens.length; i++) {
            if (ownedTokens[i] == tokenId) {
                ownedTokens[i] = ownedTokens[ownedTokens.length - 1];
                ownedTokens.pop();
                break;
            }
        }
    }

    function addOwnedToken(address owner, uint256 tokenId) external {
        _ownedTokens[owner].push(tokenId);
    }
}
