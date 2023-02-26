import { ethers, network } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import hre from "hardhat";

async function main() {
  const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const BoredApeHolder = "0x4A385286592C97e457A6f54A3734557F4b095A28";
  const [owner, holder1, holder2, holder3] = await ethers.getSigners();
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy("TrueCoin", "TRC");
  await token.deployed();

  const tokenaddress = token.address;

  console.log(`Reward Token deployed to ${tokenaddress}`);

  ///deploy Staking contract

  const Staking = await ethers.getContractFactory("BoreApeStaking");
  const staking = await Staking.deploy(tokenaddress);
  await staking.deployed();
  console.log(`Staking contract deployed to ${staking.address}`);

  // connect usdt
   const usdc = await ethers.getContractAt("IUSDT", USDC);

   const usdcAdress = usdc.address;
  console.log(`staking Token deployed to ${usdcAdress}`);

  const balance = await usdc.balanceOf(BoredApeHolder);
   console.log(`balnce is ${balance}`);

  const helpers = require("@nomicfoundation/hardhat-network-helpers");

  const address = BoredApeHolder;
  await helpers.impersonateAccount(address);
  const impersonatedSigner = await ethers.getSigner(address);
  await helpers.setBalance(address, 9000000000000000000);
  const tokenSet = await staking.setStakeToken(usdcAdress);
  //   console.log(await tokenSet.wait());
  console.log(`staked Token  ${await staking.stakeToken()}`);

  await usdc.connect(impersonatedSigner).approve(staking.address, 5000000);

  const allowance = await usdc.allowance(BoredApeHolder, staking.address);
  console.log(`allowance ${allowance.wait()}`);

  const staker1 = await staking.connect(impersonatedSigner).stake(50);
  const userInfo1 = await staking.userInfo(impersonatedSigner.address);
  console.log(`holder1 infornation ${userInfo1}`);

  await ethers.provider.send("evm_mine", [1709251199]);

  await staking.connect(impersonatedSigner).updateReward();

  const userInfo = await staking.userInfo(impersonatedSigner.address);
  console.log(`holder1 infornation ${userInfo}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});