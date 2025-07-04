const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// Network configurations (excluding Mantle Sepolia due to deployment issues)
const NETWORKS = [
    {
        name: "flow-testnet", 
        displayName: "Flow Testnet",
        envPrefix: "FLOW_TESTNET"
    },
    {
        name: "ronin-testnet",
        displayName: "Ronin Testnet", 
        envPrefix: "RONIN_TESTNET"
    },
    {
        name: "flare-coston2",
        displayName: "Flare Coston2",
        envPrefix: "FLARE_TESTNET"
    },
    {
        name: "saga-test",
        displayName: "SagaTest",
        envPrefix: "SAGA_TEST"
    },
    {
        name: "saga-demo",
        displayName: "SagaDemo",
        envPrefix: "SAGA_DEMO"
    }
];

async function deployToNetwork(networkName, displayName) {
    console.log(`\n🚀 Deploying to ${displayName}...`);
    console.log("=" + "=".repeat(displayName.length + 15));
    
    try {
        // Get the network configuration
        const networkConfig = hre.config.networks[networkName];
        if (!networkConfig) {
            throw new Error(`Network ${networkName} not found in hardhat.config.js`);
        }

        // Create provider and signer for the specific network
        const provider = new hre.ethers.JsonRpcProvider(networkConfig.url);
        const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);
        
        console.log(`📝 Deploying with account: ${wallet.address}`);
        
        // Get balance
        const balance = await provider.getBalance(wallet.address);
        console.log(`💰 Account balance: ${hre.ethers.formatEther(balance)} ETH`);
        
        if (balance === 0n) {
            throw new Error(`❌ No balance on ${displayName}. Please add funds to continue.`);
        }
        
        // Deploy TestVerifier
        console.log("📦 Deploying TestVerifier...");
        const TestVerifier = await hre.ethers.getContractFactory("TestVerifier", wallet);
        const verifier = await TestVerifier.deploy({
            gasLimit: 1000000
        });
        
        await verifier.waitForDeployment();
        console.log(`✅ TestVerifier deployed: ${verifier.target}`);
        
        // Deploy BridgeWithZKP
        console.log("📦 Deploying BridgeWithZKP...");
        const Bridge = await hre.ethers.getContractFactory("BridgeWithZKP", wallet);
        const bridge = await Bridge.deploy(verifier.target, {
            gasLimit: 2000000
        });
        
        await bridge.waitForDeployment();
        console.log(`✅ BridgeWithZKP deployed: ${bridge.target}`);
        
        return {
            network: networkName,
            displayName,
            verifier: verifier.target,
            bridge: bridge.target,
            success: true
        };
        
    } catch (error) {
        console.error(`❌ Failed to deploy to ${displayName}:`, error.message);
        return {
            network: networkName,
            displayName,
            error: error.message,
            success: false
        };
    }
}

async function updateEnvFile(deployments) {
    console.log("\n📝 Updating .env file...");
    
    const envPath = path.join(__dirname, "..", ".env");
    let envContent = "";
    
    // Read existing .env file
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, "utf8");
    }
    
    // Remove old bridge/verifier addresses to avoid duplicates
    const linesToKeep = envContent.split('\n').filter(line => {
        return !line.includes('_VERIFIER_ADDRESS=') && !line.includes('_BRIDGE_ADDRESS=');
    });
    
    // Add deployment addresses
    const newLines = [];
    for (const network of NETWORKS) {
        const deployment = deployments.find(d => d.network === network.name);
        if (deployment && deployment.success) {
            newLines.push(`REACT_APP_${network.envPrefix}_VERIFIER_ADDRESS=${deployment.verifier}`);
            newLines.push(`REACT_APP_${network.envPrefix}_BRIDGE_ADDRESS=${deployment.bridge}`);
        }
    }
    
    // Combine existing lines with new addresses
    const finalContent = [...linesToKeep, "", "# Bridge Contract Addresses", ...newLines].join('\n');
    
    // Write updated .env file
    fs.writeFileSync(envPath, finalContent);
    console.log("✅ .env file updated successfully!");
}

async function main() {
    console.log("🌉 Multi-Network Bridge Deployment Script");
    console.log("==========================================");
    console.log(`📅 Started at: ${new Date().toISOString()}`);
    
    const deployments = [];
    let successCount = 0;
    
    // Deploy to each network
    for (const network of NETWORKS) {
        const result = await deployToNetwork(network.name, network.displayName);
        deployments.push(result);
        
        if (result.success) {
            successCount++;
        }
        
        // Wait between deployments to avoid rate limiting
        if (network !== NETWORKS[NETWORKS.length - 1]) {
            console.log("⏳ Waiting 5 seconds before next deployment...");
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
    
    // Update .env file with successful deployments
    await updateEnvFile(deployments);
    
    // Print deployment summary
    console.log("\n📊 DEPLOYMENT SUMMARY");
    console.log("=====================");
    console.log(`✅ Successful deployments: ${successCount}/${NETWORKS.length}`);
    
    deployments.forEach(deployment => {
        if (deployment.success) {
            console.log(`\n🟢 ${deployment.displayName}:`);
            console.log(`   Verifier: ${deployment.verifier}`);
            console.log(`   Bridge:   ${deployment.bridge}`);
        } else {
            console.log(`\n🔴 ${deployment.displayName}: FAILED`);
            console.log(`   Error: ${deployment.error}`);
        }
    });
    
    // Print network information
    console.log("\n🌐 NETWORK INFORMATION");
    console.log("======================");
    console.log("Flow Testnet:");
    console.log("  - Chain ID: 545");
    console.log("  - RPC: https://testnet.evm.nodes.onflow.org");
    console.log("  - Explorer: https://testnet.flowdiver.io");
    
    console.log("\nRonin Testnet:");
    console.log("  - Chain ID: 2021");
    console.log("  - Faucet: https://faucet.roninchain.com/");
    console.log("  - Explorer: https://saigon-explorer.roninchain.com");
    
    console.log("\nFlare Coston2:");
    console.log("  - Chain ID: 114");
    console.log("  - Faucet: https://coston2-faucet.towolabs.com/");
    console.log("  - Explorer: https://coston2-explorer.flare.network");
    
    console.log("\nSagaTest:");
    console.log("  - Chain ID: 2751645467413000");
    console.log("  - RPC: https://sagatest-2751645467413000-1.jsonrpc.sagarpc.io");
    console.log("  - Explorer: https://sagatest-2751645467413000-1.jsonrpc.sagarpc.io");
    
    console.log("\nSagaDemo:");
    console.log("  - Chain ID: 2751645565611000");
    console.log("  - RPC: https://sagademo-2751645565611000-1.jsonrpc.sagarpc.io");
    console.log("  - Explorer: https://sagademo-2751645565611000-1.jsonrpc.sagarpc.io");
    
    if (successCount === NETWORKS.length) {
        console.log("\n🎉 All deployments completed successfully!");
        console.log("🚀 Your cross-chain bridge is ready for testing!");
    } else {
        console.log(`\n⚠️  ${NETWORKS.length - successCount} deployment(s) failed. Check the errors above.`);
    }
    
    console.log("\n🔧 Next steps:");
    console.log("1. Start your React app: SKIP_PREFLIGHT_CHECK=true npm start");
    console.log("2. Connect your wallet and add the networks");
    console.log("3. Get testnet tokens from the faucets above");
    console.log("4. Test cross-chain swaps between networks!");
}

// Handle errors gracefully
main()
    .then(() => {
        console.log("\n✅ Deployment script completed!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Deployment script failed:", error);
        process.exit(1);
    }); 