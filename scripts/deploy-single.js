const hre = require("hardhat");

async function main() {
    const networkName = hre.network.name;
    console.log(`🚀 Deploying to ${networkName}...`);
    
    try {
        const [deployer] = await hre.ethers.getSigners();
        console.log("Deploying contracts with the account:", deployer.address);
        
        const balance = await deployer.provider.getBalance(deployer.address);
        console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

        // Deploy TestVerifier
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

        console.log("\n✅ Deployment complete!");
        console.log("Network:", hre.network.name);
        console.log("TestVerifier:", verifier.target);
        console.log("BridgeWithZKP:", bridge.target);
        
        // Print env variables for easy copying
        const networkPrefix = networkName.toUpperCase().replace(/-/g, '_');
        console.log("\n📝 Environment variables:");
        console.log(`REACT_APP_${networkPrefix}_VERIFIER_ADDRESS=${verifier.target}`);
        console.log(`REACT_APP_${networkPrefix}_BRIDGE_ADDRESS=${bridge.target}`);
        
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