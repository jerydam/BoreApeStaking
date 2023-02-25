import { ethers, network } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import hre from "hardhat";

async function main() {
  const USDT = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const USDTHolder = "0x748dE14197922c4Ae258c7939C7739f3ff1db573";
  const [owner, holder1, holder2, holder3] = await ethers.getSigners();
  const Token = await ethers.getContractFactory("BoreApeStaking");
  const token = await Token.deploy("web3Bridge", "VIII");
  await token.deployed();

  const tokenaddress = token.address;

  console.log(`Reward Token deployed to ${tokenaddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
