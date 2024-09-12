const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("TokenA, NFTB, and Logic Contracts", function () {
  async function deployContractsFixture() {
    const [owner, user1, user2] = await ethers.getSigners();

    const TokenA = await ethers.getContractFactory("TokenA");
    const tokenA = await TokenA.deploy();

    const NFTB = await ethers.getContractFactory("NFTB");
    const nftB = await NFTB.deploy();

    const Logic = await ethers.getContractFactory("Logic");
    const logic = await Logic.deploy(await tokenA.getAddress(), await nftB.getAddress());

    // Approve Logic contract for transfers
    await tokenA.approveForTransfer(await logic.getAddress());

    return { tokenA, nftB, logic, owner, user1, user2 };
  }

  describe("TokenA Contract", function () {
    it("Should mint cap to owner", async function () {
      const { tokenA, owner } = await loadFixture(deployContractsFixture);
      const cap = await tokenA.cap();
      expect(await tokenA.balanceOf(owner.address)).to.equal(cap);
    });

    it("Should allow faucet", async function () {
      const { tokenA, user1 } = await loadFixture(deployContractsFixture);
      const faucetAmount = ethers.parseEther("1000");
      await tokenA.connect(user1).faucet(faucetAmount);
      expect(await tokenA.balanceOf(user1.address)).to.equal(faucetAmount);
    });

    it("Should fail faucet if not enough allowance", async function () {
      const { tokenA, user1 } = await loadFixture(deployContractsFixture);
      const largeAmount = ethers.parseEther("1000000000000");
      await expect(tokenA.connect(user1).faucet(largeAmount)).to.be.revertedWith("TokenA: Not enough allowance");
    });
  });

  describe("NFTB Contract", function () {
    it("Should mint NFT", async function () {
      const { nftB, user1 } = await loadFixture(deployContractsFixture);
      await nftB.mint(user1.address);
      expect(await nftB.balanceOf(user1.address)).to.equal(1);
    });

    it("Should get owned tokens", async function () {
      const { nftB, user1 } = await loadFixture(deployContractsFixture);
      await nftB.mint(user1.address);
      await nftB.mint(user1.address);
      const ownedTokens = await nftB.getOwnedTokens(user1.address);
      expect(ownedTokens.length).to.equal(2);
      expect(ownedTokens[0]).to.equal(0);
      expect(ownedTokens[1]).to.equal(1);
    });
  });

  describe("Logic Contract", function () {
    it("Should deposit TokenA", async function () {
      const { tokenA, logic, user1 } = await loadFixture(deployContractsFixture);
      const depositAmount = ethers.parseEther("1000");
      await tokenA.connect(user1).faucet(depositAmount);
      await tokenA.connect(user1).approve(await logic.getAddress(), depositAmount);
      await logic.connect(user1).depositTokenA(depositAmount);
      const depositInfo = await logic.getDepositInfo(user1.address);
      expect(depositInfo[0]).to.equal(depositAmount);
    });

    it("Should fail to deposit TokenA with insufficient allowance", async function () {
      const { tokenA, logic, user1 } = await loadFixture(deployContractsFixture);
      const depositAmount = ethers.parseEther("1000");
      await tokenA.connect(user1).faucet(depositAmount);
      await expect(logic.connect(user1).depositTokenA(depositAmount)).to.be.revertedWith("Insufficient allowance");
    });

    it("Should deposit NFTB", async function () {
      const { nftB, logic, user1 } = await loadFixture(deployContractsFixture);
      await nftB.mint(user1.address);
      await nftB.connect(user1).approve(await logic.getAddress(), 0);
      await logic.connect(user1).depositNFTB(0);
      const depositInfo = await logic.getDepositInfo(user1.address);
      expect(depositInfo[1]).to.equal(1); // nftCount
    });

    it("Should fail to deposit NFTB not owned", async function () {
      const { nftB, logic, user1, user2 } = await loadFixture(deployContractsFixture);
      await nftB.mint(user1.address);
      await expect(logic.connect(user2).depositNFTB(0)).to.be.revertedWith("You do not own this NFT");
    });

    it("Should withdraw TokenA after lock time", async function () {
      const { tokenA, logic, user1 } = await loadFixture(deployContractsFixture);
      const depositAmount = ethers.parseEther("1000");
      await tokenA.connect(user1).faucet(depositAmount);
      await tokenA.connect(user1).approve(await logic.getAddress(), depositAmount);
      await logic.connect(user1).depositTokenA(depositAmount);
      
      // set timer
      await ethers.provider.send("evm_increaseTime", [31]);
      await ethers.provider.send("evm_mine");

      await logic.connect(user1).withdrawTokenA(depositAmount);
      const depositInfo = await logic.getDepositInfo(user1.address);
      expect(depositInfo[0]).to.equal(0);
    });

    it("Should fail to withdraw TokenA before lock time", async function () {
      const { tokenA, logic, user1 } = await loadFixture(deployContractsFixture);
      const depositAmount = ethers.parseEther("1000");
      await tokenA.connect(user1).faucet(depositAmount);
      await tokenA.connect(user1).approve(await logic.getAddress(), depositAmount);
      await logic.connect(user1).depositTokenA(depositAmount);
      
      await expect(logic.connect(user1).withdrawTokenA(depositAmount)).to.be.revertedWith("Tokens are locked");
    });

    it("Should withdraw NFTB", async function () {
      const { nftB, logic, user1 } = await loadFixture(deployContractsFixture);
      await nftB.mint(user1.address);
      await nftB.connect(user1).approve(await logic.getAddress(), 0);
      await logic.connect(user1).depositNFTB(0);
      await logic.connect(user1).withdrawNFTB(0);
      expect(await nftB.ownerOf(0)).to.equal(user1.address);
    });

    it("Should fail to withdraw NFTB not deposited", async function () {
      const { nftB, logic, user1 } = await loadFixture(deployContractsFixture);
      await nftB.mint(user1.address);
      await expect(logic.connect(user1).withdrawNFTB(0)).to.be.revertedWith("You don't have any NFTs deposited");
    });

    it("Should claim reward", async function () {
      const { tokenA, logic, user1 } = await loadFixture(deployContractsFixture);
      const depositAmount = ethers.parseEther("1000");
      await tokenA.connect(user1).faucet(depositAmount);
      await tokenA.connect(user1).approve(await logic.getAddress(), depositAmount);
      await logic.connect(user1).depositTokenA(depositAmount);
      
      // set timer
      await ethers.provider.send("evm_increaseTime", [365 * 24 * 60 * 60]); // 1 year
      await ethers.provider.send("evm_mine");

      await logic.connect(user1).claimReward();
      const finalBalance = await tokenA.balanceOf(user1.address);
      expect(finalBalance.toString()).to.be.equal("80000002536783358701");

    });

    it("Should fail to claim reward with no deposit", async function () {
      const { logic, user1 } = await loadFixture(deployContractsFixture);
      await expect(logic.connect(user1).claimReward()).to.be.revertedWith("No tokens deposited");
    });

    it("Should update APR", async function () {
      const { logic, owner } = await loadFixture(deployContractsFixture);
      const newAPR = 10;
      await logic.connect(owner).setAPR(newAPR);
      expect(await logic.getAPR()).to.equal(newAPR);
    });
  });
});