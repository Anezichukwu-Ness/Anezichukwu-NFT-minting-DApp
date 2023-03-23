// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { utils } = require("ethers");

async function main() {
    const baseTokenURI = "ipfs://QmXQYuYp6fMXjiQPPgBhTAGY5V1CJcApRcK7tLXSPDvzSD/";

    // Get owner/deployer's wallet address
    const [owner] = await hre.ethers.getSigners();

    // Get contract that we want to deploy
    const contractFactory = await hre.ethers.getContractFactory("Save_The_Environment");

    // Deploy contract with the correct constructor arguments
    const contract = await contractFactory.deploy(baseTokenURI);

    // Wait for this transaction to be mined
    await contract.deployed();

    // Get contract address
    console.log("Contract deployed to:", contract.address);

    console.log("Sleeping.....");
    // Wait for etherscan to notice that the contract has been deployed
    await sleep(30000);
  
    // Verify the contract after deploying
    await hre.run("verify:verify", {
      address: contract.address,
      constructorArguments: [baseTokenURI],
    });
}
  
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

    

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
