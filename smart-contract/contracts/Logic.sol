// SPDX-License_identifier: MIT
pragma solidity ^0.8.24;

import "./TokenA.sol";
import "./NFTB.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Logic is Ownable {
    TokenA public tokenA;
    NFTB public nftB;

    // constant variables
    uint8 public BASE_APR = 8;
    uint8 public BASE_APR_INCREMENT = 2;
    uint32 public LOCK_TIME = 30 seconds;
    uint256 public THRESHOLD = 1_000_000 * 10 ** 18;

    // data structure
    mapping(address => DepositInfo) public deposits;
    mapping(address => uint[]) userNFTDepositeds;

    struct DepositInfo {
        uint256 amountTokenA;
        uint256 nftCount;
        uint256 timestamp;
        uint256 timestampDepositTokenA;
        uint256 interest;
        uint8 apr;
    }

    // events
    event DepositTokenA(address indexed user, uint256 amount, uint256 timestamp);
    event DepositNFTB(address indexed user, uint256 tokenId, uint256 timestamp);
    event WithdrawTokenA(address indexed user, uint256 amount, uint256 timestamp);
    event WithdrawNFTB(address indexed user, uint256 tokenId, uint256 timestamp);
    event ClaimReward(address indexed user, uint256 amount, uint256 timestamp);

    // constructor
    constructor(TokenA _tokenA, NFTB _nftB) Ownable(msg.sender) {
        tokenA = _tokenA;
        nftB = _nftB;
    }

    // main functions
    function depositTokenA(uint256 _amount) external {
        updateInterest(msg.sender);

        require(_amount > 0, "Amount must be greater than 0");
        require(
            tokenA.allowance(msg.sender, address(this)) >= _amount,
            "Insufficient allowance"
        );

        if (deposits[msg.sender].amountTokenA == 0) {
            deposits[msg.sender].apr = BASE_APR;
            deposits[msg.sender].interest = 0;
        }

        deposits[msg.sender].amountTokenA += _amount;
        deposits[msg.sender].timestampDepositTokenA = block.timestamp;

        // mint NFTB based on the amount of TokenA deposited
        uint256 nftToMint = deposits[msg.sender].amountTokenA /
            THRESHOLD -
            deposits[msg.sender].nftCount;
        for (uint256 i = 0; i < nftToMint; i++) {
            nftB.mint(msg.sender);
            deposits[msg.sender].nftCount++;
        }

        emit DepositTokenA(msg.sender, _amount, block.timestamp);

        tokenA.transferFrom(msg.sender, address(this), _amount);
    }

    function depositNFTB(uint256 _tokenId) external {
        updateInterest(msg.sender);

        require(
            nftB.ownerOf(_tokenId) == msg.sender,
            "You do not own this NFT"
        );

        // update the deposit info
        deposits[msg.sender].nftCount++;
        deposits[msg.sender].apr += BASE_APR_INCREMENT;
        deposits[msg.sender].timestamp = block.timestamp;

        uint[] storage userDepositNFT = userNFTDepositeds[msg.sender];
        userDepositNFT.push(_tokenId);

        emit DepositNFTB(msg.sender, _tokenId, block.timestamp);

        nftB.transferFrom(msg.sender, address(this), _tokenId);
    }

    function withdrawTokenA(uint256 _amount) external {
        updateInterest(msg.sender);

        require(_amount > 0, "Amount must be greater than 0");
        require(
            deposits[msg.sender].amountTokenA >= _amount,
            "Insufficient balance"
        );
        require(
            block.timestamp - deposits[msg.sender].timestampDepositTokenA >= LOCK_TIME,
            "Tokens are locked"
        );

        deposits[msg.sender].amountTokenA -= _amount;

        emit WithdrawTokenA(msg.sender, _amount, block.timestamp);

        tokenA.transfer(msg.sender, _amount);
    }

    function withdrawNFTB(uint256 _tokenId) external {
        updateInterest(msg.sender);

        require(
            userNFTDepositeds[msg.sender].length > 0,
            "You don't have any NFTs deposited"
        );

        require(
            nftB.ownerOf(_tokenId) == address(this),
            "NFT is not deposited"
        );

        // update deposits info
        deposits[msg.sender].nftCount--;
        deposits[msg.sender].apr -= BASE_APR_INCREMENT;

        // remove the NFT from the user's deposit list
        uint[] storage userDepositNFT = userNFTDepositeds[msg.sender];
        for (uint i = 0; i < userDepositNFT.length; i++) {
            if (userDepositNFT[i] == _tokenId) {
                userDepositNFT[i] = userDepositNFT[userDepositNFT.length - 1];
                userDepositNFT.pop();
                break;
            }
        }

        emit WithdrawNFTB(msg.sender, _tokenId, block.timestamp);

        nftB.transferFrom(address(this), msg.sender, _tokenId);
    }

    function claimReward() external {
        updateInterest(msg.sender);

        require(deposits[msg.sender].amountTokenA > 0, "No tokens deposited");
        uint256 reward = deposits[msg.sender].interest;
        deposits[msg.sender].interest = 0;

        emit ClaimReward(msg.sender, reward, block.timestamp);

        tokenA.transfer(msg.sender, reward);
    }

    // support functions
    function updateInterest(address _user) public {
        uint256 duration = block.timestamp - deposits[_user].timestamp;
        uint256 interest = (deposits[_user].amountTokenA *
            deposits[_user].apr *
            duration) / 365 days;
        deposits[_user].interest += interest;
        deposits[_user].timestamp = block.timestamp;
    }

    // getters functions
    function getDepositInfo(
        address _user
    )
        external
        view
        returns (
            uint256 amountTokenA,
            uint256 nftCount,
            uint256 timestamp,
            uint256 interest,
            uint8 apr
        )
    {
        DepositInfo storage deposit = deposits[_user];
        return (
            deposit.amountTokenA,
            deposit.nftCount,
            deposit.timestamp,
            deposit.interest,
            deposit.apr
        );
    }

    function getAPR() external view returns (uint) {
        return BASE_APR;
    }

    function getNFTDepositeds(
        address account
    ) external view returns (uint[] memory) {
        return userNFTDepositeds[account];
    }

    // setter functions
    function setAPR(uint8 APR) external onlyOwner {
        BASE_APR = APR;
    }
}
