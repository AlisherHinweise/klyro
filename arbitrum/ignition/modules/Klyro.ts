// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import hre from "hardhat";

async function main() {
  const Klyro = await hre.ethers.getContractFactory("Klyro");
  const klyro = await Klyro.deploy();

  await klyro.waitForDeployment();
  const klyroAddress = await klyro.getAddress();

  console.log("Klyro deployed at:", klyroAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
