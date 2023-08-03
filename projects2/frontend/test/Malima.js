const { expect } = require("chai");
const {ethers} = require("hardhat");

describe("MalimaToken", function () {
  let Malima;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    const malimaContract = await ethers.getContractFactory("EPIToken");
    Malima = await malimaContract.deploy();

    // Mint some tokens to the contract creator
    await Malima.mint(owner.address, 6);
  });

  it("Should return the correct name, symbol, and total supply", async function () {
    expect(await Malima.name()).to.equal("Eth Proof Intermediate Token");
    expect(await Malima.symbol()).to.equal("EPI");
    expect(await Malima.totalSupply()).to.equal(12);
  });

  it("Should update balances after minting and burning tokens", async function () {
    // Mint some tokens to address 1
    await Malima.connect(owner).mint(addr1.address, 2);

    expect(await Malima.balances(addr1.address)).to.equal(2);
    expect(await Malima.totalSupply()).to.equal(14);

    // Burn some tokens from the contract creator
    await Malima.connect(owner).burn(3);

    expect(await Malima.balances(owner.address)).to.equal(9);
    expect(await Malima.totalSupply()).to.equal(11);
  });

  it("Should revert if an invalid address is provided to mint", async function () {
    await expect(Malima.connect(owner).mint("0x2546BcD3c84621e976D8185a91A922aE77ECEc30", 1)).to.be.revertedWith("Invalid address");
  });

  it("Should revert if the contract creator doesn't have sufficient balance to burn", async function () {
    await expect(Malima.connect(owner).burn(16)).to.be.revertedWith("Insufficient balance");
  });
});
