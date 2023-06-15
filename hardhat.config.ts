import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();
require('@openzeppelin/hardhat-upgrades');
//require('dotenv').config();


const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // Adjust the runs value as per your requirements
      }}},
  networks: {
    hardhat:{},
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org", // ALFAJORES
      accounts:{
        mnemonic: process.env.MUMBAI_WALLET_PRIVATE_KEY ,
      }
    }
  }
};

export default config;