const hre = require("hardhat");

async function main() {
    try {
        const [deployer] = await hre.ethers.getSigners();
        console.log("Deploying contracts with the account:", deployer.address);
        
        const balance = await deployer.provider.getBalance(deployer.address);
        console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

        // Deploy TestVerifier with automatic gas estimation
        console.log("Deploying TestVerifier...");
        const TestVerifier = await hre.ethers.getContractFactory("TestVerifier");
        
        // Estimate gas for deployment
        const deploymentData = TestVerifier.getDeployTransaction();
        const estimatedGas = await deployer.estimateGas(deploymentData);
        console.log("Estimated gas for TestVerifier:", estimatedGas.toString());
        
        const verifier = await TestVerifier.deploy();
        
        console.log("Waiting for TestVerifier deployment...");
        await verifier.waitForDeployment();
        console.log("TestVerifier deployed to:", verifier.target);

        // Deploy the Bridge contract with automatic gas estimation
        console.log("Deploying BridgeWithZKP...");
        const Bridge = await hre.ethers.getContractFactory("BridgeWithZKP");
        
        // Estimate gas for bridge deployment
        const bridgeDeploymentData = Bridge.getDeployTransaction(verifier.target);
        const bridgeEstimatedGas = await deployer.estimateGas(bridgeDeploymentData);
        console.log("Estimated gas for BridgeWithZKP:", bridgeEstimatedGas.toString());
        
        const bridge = await Bridge.deploy(verifier.target);
        
        console.log("Waiting for Bridge deployment...");
        await bridge.waitForDeployment();
        console.log("Bridge deployed to:", bridge.target);

        console.log("Deployment complete!");
        console.log("Network:", hre.network.name);
        console.log("TestVerifier:", verifier.target);
        console.log("BridgeWithZKP:", bridge.target);
        
        // Update .env file
        console.log("\nUpdating .env file...");
        const fs = require("fs");
        const path = require("path");
        
        const envPath = path.join(__dirname, "..", ".env");
        let envContent = "";
        
        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, "utf8");
        }
        
        // Remove old Mantle addresses
        const lines = envContent.split('\n').filter(line => 
            !line.includes('MANTLE_SEPOLIA_VERIFIER_ADDRESS=') && 
            !line.includes('MANTLE_SEPOLIA_BRIDGE_ADDRESS=')
        );
        
        // Add new addresses
        lines.push(`REACT_APP_MANTLE_SEPOLIA_VERIFIER_ADDRESS=${verifier.target}`);
        lines.push(`REACT_APP_MANTLE_SEPOLIA_BRIDGE_ADDRESS=${bridge.target}`);
        
        fs.writeFileSync(envPath, lines.join('\n'));
        console.log("✅ .env file updated!");
        
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