const { ethers, upgrades } = require("hardhat");

// Just to Testing Cases

async function main2() {
  
    const coin = await ethers.getContractFactory("TokenBits");
    const Coin = await upgrades.deployProxy(coin, [], { initializer: "initialize" }, {kind: "uups"});
    const COIN = await Coin.deployed();

    const certi = await ethers.getContractFactory("CertiBits");
    const Certi = await upgrades.deployProxy(certi, [COIN.address, ethers.utils.parseEther("50")], { initializer: "initialize" }, {kind: "uups"}); //50 Tokens Reward
    const CERTI = await Certi.deployed();

    const Value = "Bro";

    console.log(CERTI.address);

    
}

main2();