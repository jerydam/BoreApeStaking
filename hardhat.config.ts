import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();
const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      forking: {
        enabled: true,
        url: "https://eth-mainnet.g.alchemy.com/v2/_h7b0uQquHnoOk3x_Bc8ciWU9q4uzEsc",
      },
    },
    goerli: {
      url: process.env.GOERLI_RPC,
      //@ts-ignore
      accounts:[process.env.PRIVATE_KEY]},
  },
  etherscan: {
    apiKey: process.env.API_KEY,
  }
};

export default config;