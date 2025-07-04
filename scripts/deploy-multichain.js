const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Network:", hre.network.name);

    try {
        // Deploy TestVerifier
        console.log("Deploying TestVerifier...");
        const TestVerifier = await hre.ethers.getContractFactory("TestVerifier");
        const verifier = await TestVerifier.deploy();
        await verifier.waitForDeployment();
        console.log(`TestVerifier deployed to: ${verifier.target} on ${hre.network.name}`);

        // Deploy the Bridge contract
        console.log("Deploying BridgeWithZKP...");
        const Bridge = await hre.ethers.getContractFactory("BridgeWithZKP");
        const bridge = await Bridge.deploy(verifier.target);
        await bridge.waitForDeployment();
        console.log(`Bridge deployed to: ${bridge.target} on ${hre.network.name}`);

        // Save deployment info
        console.log("\n=== Deployment Summary ===");
        console.log(`Network: ${hre.network.name}`);
        console.log(`TestVerifier: ${verifier.target}`);
        console.log(`BridgeWithZKP: ${bridge.target}`);
        console.log(`Deployer: ${deployer.address}`);
        
        // Generate environment variable names
        const networkName = hre.network.name.toUpperCase().replace(/-/g, '_');
        console.log(`\nAdd these to your .env file:`);
        console.log(`REACT_APP_${networkName}_VERIFIER_ADDRESS=${verifier.target}`);
        console.log(`REACT_APP_${networkName}_BRIDGE_ADDRESS=${bridge.target}`);
        
    } catch (error) {
        console.error(`Deployment failed on ${hre.network.name}:`, error.message);
        throw error;
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 