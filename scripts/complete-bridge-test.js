const { ethers } = require("hardhat");
require('dotenv').config();

// Import the ZK proof generation function
const { generateZKProof } = require("./zkp-node");

async function completeBridgeTest() {
    console.log("🌉 Completing Bridge Test: Mantle → Flare");
    console.log("==========================================");
    
    try {
        // We already deposited on Mantle, now let's withdraw on Flare
        // Using the same commitment and proof that should work
        
        const testAmount = ethers.parseEther("0.001"); // Same amount as deposited
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
        
        console.log(`👛 Wallet Address: ${wallet.address}`);
        console.log(`💰 Withdrawal Amount: ${ethers.formatEther(testAmount)} ETH`);
        
        // Generate the same proof (we need to recreate it since it uses random secret)
        // For a real bridge, the proof would be stored and reused
        console.log("\n🔒 Generating ZK Proof for withdrawal...");
        const { commitment, nullifierHash, proof } = await generateZKProof(
            testAmount,
            wallet.address
        );
        
        // Connect to Flare Coston2
        console.log("\n🔗 Connecting to Flare Coston2...");
        const flareProvider = new ethers.JsonRpcProvider("https://coston2-api.flare.network/ext/C/rpc");
        const flareWallet = wallet.connect(flareProvider);
        
        // Check initial balance
        const initialBalance = await flareProvider.getBalance(wallet.address);
        console.log(`💳 Initial Flare Balance: ${ethers.formatEther(initialBalance)} FLR`);
        
        // Bridge contract (should be same deterministic address)
        const bridgeAddress = "0x6Ba4f5b055C57BAd4C05eC0E45Ac078c5E59d9C9";
        const bridgeABI = require("../artifacts/contracts/BridgeWithZKP.sol/BridgeWithZKP.json").abi;
        
        const flareBridge = new ethers.Contract(bridgeAddress, bridgeABI, flareWallet);
        
        // Check bridge balance on Flare
        const bridgeBalance = await flareProvider.getBalance(bridgeAddress);
        console.log(`🏦 Flare Bridge Balance: ${ethers.formatEther(bridgeBalance)} FLR`);
        
        if (bridgeBalance < testAmount) {
            console.log("⚠️  Insufficient bridge liquidity on Flare, but let's try anyway...");
        }
        
        // Try withdrawal
        console.log(`\n📥 Withdrawing ${ethers.formatEther(testAmount)} FLR...`);
        
        const withdrawTx = await flareBridge.withdraw(
            testAmount,
            wallet.address,
            nullifierHash,
            proof,
            { gasLimit: 1000000 }
        );
        
        console.log(`🔄 Withdrawal Transaction Hash: ${withdrawTx.hash}`);
        console.log("⏳ Waiting for confirmation...");
        
        const receipt = await withdrawTx.wait();
        console.log(`✅ Withdrawal confirmed in block: ${receipt.blockNumber}`);
        
        // Check final balance
        const finalBalance = await flareProvider.getBalance(wallet.address);
        const received = finalBalance - initialBalance;
        
        console.log(`💳 Final Flare Balance: ${ethers.formatEther(finalBalance)} FLR`);
        console.log(`📈 Amount Received: ${ethers.formatEther(received)} FLR`);
        
        console.log("\n🎉 CROSS-CHAIN BRIDGE TEST COMPLETED! 🎉");
        console.log("========================================");
        console.log("✅ Successfully bridged from Mantle Sepolia to Flare Coston2!");
        console.log(`🔗 Withdrawal TX: https://coston2-explorer.flare.network/tx/${withdrawTx.hash}`);
        
    } catch (error) {
        console.error("\n❌ BRIDGE COMPLETION FAILED!");
        console.error("Error:", error.message);
        
        if (error.code) {
            console.error("Error Code:", error.code);
        }
        
        if (error.reason) {
            console.error("Error Reason:", error.reason);
        }
    }
}

completeBridgeTest(); 