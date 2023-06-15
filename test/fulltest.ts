//const { expect } = require("chai");
//const { ethers } = require("hardhat");
//const { loadFixture} = require("@nomicfoundation/hardhat-network-helpers");
//const { BigNumber, utils} = require("ethers");
//import "@nomicfoundation/hardhat-toolbox";

import {
    loadFixture
  } from "@nomicfoundation/hardhat-network-helpers";

 import { expect } from "chai";
 import { utils, BigNumber} from "ethers";
 const { ethers, upgrades } = require("hardhat");



describe("CertiBits", function () {
  
  async function deploy() {


    const [signer,owner,account1,account2,account3,coin2] = await ethers.getSigners();

    const coin = await ethers.getContractFactory("TokenBits");
    const Coin = await upgrades.deployProxy(coin, [], { initializer: "initialize" }, {kind: "uups"});
    //const Coin = await coin.deploy();
    const COIN = await Coin.deployed();

    //ethers.utils.parseEther("50")

    const CTV2 = await ethers.getContractFactory("CertiBitsV2");

    const certi = await ethers.getContractFactory("CertiBits");
    const Certi = await upgrades.deployProxy(certi, [COIN.address, ethers.utils.parseEther("50")], { initializer: "initialize" }, {kind: "uups"}); //50 Tokens Reward
    const CERTI = await Certi.deployed();

    const BITS_ROLE = utils.solidityKeccak256(["string"], ["BITS_ROLE"]);

    await COIN.grantRole(BITS_ROLE,CERTI.address); // ERC20 ACCES TO MINT FROM CERTI REWARD 

    return {CERTI, COIN, signer, owner, account1, account2,account3,coin2,CTV2};

  }

  
  it("Should have the correct reward amount", async function () {
    const { CERTI } = await loadFixture(deploy);
    const expectedRewardAmount = 50;
    const call = await CERTI.setReward(50);
    const actualRewardAmount = await CERTI.bonusReward();
    expect(actualRewardAmount).to.equal(expectedRewardAmount);

  });

    it("Should have the correct balance after certify", async function () {
    const { CERTI,COIN,account1} = await loadFixture(deploy);
    const hash = "0x1234567890";
    const data = "test data";
    const initialBalance = await COIN.balanceOf(account1.address);
    await CERTI.connect(account1).Certify(hash, data, { value: ethers.utils.parseEther("1")});
    const finalBalance = await COIN.balanceOf(account1.address);
    const certiAmount = BigNumber.from(await CERTI.bonusReward());
    expect(finalBalance).to.equal(initialBalance.add(certiAmount));
  });

  it("Should have the correct certify", async function () {
    const { CERTI,account2 } = await loadFixture(deploy);
    const hash = "0x1234567890";
    const data = "test data";

    await CERTI.connect(account2).Certify(hash, data, { value: ethers.utils.parseEther("1")});
    const signatures = await CERTI.validateHash(hash);

    expect(signatures[0].signer).to.equal(account2.address);
    expect(signatures[0].sign_data).to.equal(data);
});

it("Should have the correct number of signatures after certify", async function () {
  const { CERTI,signer } = await loadFixture(deploy);
  const hash = "0x1234567890";
  const data = "test data";
  const certifyAmount = 1;

  await CERTI.connect(signer).Certify(hash, data, {value: ethers.utils.parseEther("1") });
  const signatureCount = await CERTI.validateHashLength(hash);
  expect(signatureCount).to.equal(certifyAmount);
});
 

it("Should have the correct signatures after certify", async function () {
  const { CERTI,account3 } = await loadFixture(deploy);
  const hash = "0x1234567890";
  const data = "test data";
  await CERTI.connect(account3).Certify(hash, data, {value: ethers.utils.parseEther("1") });
  const mySignature = await CERTI.connect(account3).mySignatures();
  expect(mySignature[0]).to.equal(hash);
});


it("Should have the correct number of signatures count after certify", async function () {
  const { CERTI,account3 } = await loadFixture(deploy);
  const hash = "0x1234567890";
  const data = "test data";
  await CERTI.connect(account3).Certify(hash, data, {value: ethers.utils.parseEther("1") });
  const mySignatureCount = await CERTI.connect(account3).mySignaturesLength();
  expect(mySignatureCount).to.equal(1);
});


it("Should have the correct Hash and data and Signer", async function () {
  const { CERTI,account3 } = await loadFixture(deploy);
  const hash = "0x1234567890";
  const data = "test data";
  await CERTI.connect(account3).Certify(hash, data, {value: ethers.utils.parseEther("1") });
  const [address, string] = await CERTI.connect(account3).validateSingleHash(hash,0);
  expect(address).to.equal(account3.address);
  expect(string).to.equal(data)
});


it("Should have the correct Hash and signer", async function () {
  const { CERTI,account3 } = await loadFixture(deploy);
  const hash = "0x1234567890";
  const data = "test data";
  await CERTI.connect(account3).Certify(hash, data, {value: ethers.utils.parseEther("1") });
  const hashValid= await CERTI.connect(account3).mySingleSignature(0);
  expect(hash).to.equal(hashValid)
});

it("Should have the correct recipient", async function () {
    const { CERTI,account3} = await loadFixture(deploy);
    await CERTI.changeRecipient(account3.address)
    const a = await CERTI.recipient();
    expect(a).to.equal(account3.address)
  });

  it("change token address", async function () {
    const { CERTI,coin2 } = await loadFixture(deploy);
    await CERTI.changeTokenAddress(coin2.address)
  });
  

})
 