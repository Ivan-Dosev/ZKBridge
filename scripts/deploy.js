const hre = require("hardhat");

async function main() {
    try {
        const [deployer] = await hre.ethers.getSigners();
        console.log("Deploying contracts with the account:", deployer.address);
        
        const balance = await deployer.provider.getBalance(deployer.address);
        console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

        // Deploy TestVerifier with gas configuration
        console.log("Deploying TestVerifier...");
        const TestVerifier = await hre.ethers.getContractFactory("TestVerifier");
        const verifier = await TestVerifier.deploy({
            gasLimit: 1000000
        });
        
        console.log("Waiting for TestVerifier deployment...");
        await verifier.waitForDeployment();
        console.log("TestVerifier deployed to:", verifier.target);

        // Deploy the Bridge contract
        console.log("Deploying BridgeWithZKP...");
        const Bridge = await hre.ethers.getContractFactory("BridgeWithZKP");
        const bridge = await Bridge.deploy(verifier.target, {
            gasLimit: 2000000
        });
        
        console.log("Waiting for Bridge deployment...");
        await bridge.waitForDeployment();
        console.log("Bridge deployed to:", bridge.target);

        console.log("Deployment complete!");
        console.log("Network:", hre.network.name);
        console.log("TestVerifier:", verifier.target);
        console.log("BridgeWithZKP:", bridge.target);
        
    } catch (error) {
        console.error("Deployment failed:", error);
        throw error;
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 