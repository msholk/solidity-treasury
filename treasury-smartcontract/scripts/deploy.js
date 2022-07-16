// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  //We're getting the contract owner from the ethers object. 
  const [owner] = await hre.ethers.getSigners();
  //This is where the magic happens, we get the contract using getContractFactory and our contract name. 
  //Then it is compiled and the output is the resulting files in the artifacts folder.
  const BankContractFactory = await hre.ethers.getContractFactory("Bank");
  //deploys our contract on the local Hardhat network which we might want to use for debugging purposes.
  const BankContract = await BankContractFactory.deploy();
  // to deploy to the actual blockchain of our choice. In this case the Rinkeby testnet.
  await BankContract.deployed();

  console.log("BankContract deployed to:", BankContract.address);
  console.log("BankContract owner address:", owner.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
