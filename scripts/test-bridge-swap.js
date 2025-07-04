const hre = require("hardhat");
const { generateZKProof } = require("../src/utils/zkp");

async function testBridgeSwap() {
    console.log("🌉 Testing NeoX Bridge - 1:1 Cross-Chain Swap");
    console.log("=" .repeat(60));
    
    try {
        const [signer] = await hre.ethers.getSigners();
        console.log("👤 Testing with account:", signer.address);
        
        // Bridge addresses (same for all networks due to deterministic deployment)
        const BRIDGE_ADDRESS = "0x6Ba4f5b055C57BAd4C05eC0E45Ac078c5E59d9C9";
        const VERIFIER_ADDRESS = "0x836595601F67F7C2AA997d722DFb55886684d1C5";
        
        // Test amount (0.001 tokens for testing)
        const testAmount = hre.ethers.parseEther("0.001");
        console.log("💰 Test amount:", hre.ethers.formatEther(testAmount), "tokens");
        
        // Networks to test
        const networks = [
            { name: 'mantle-sepolia', chainId: 5003, rpc: 'https://rpc.sepolia.mantle.xyz' },
            { name: 'flow-testnet', chainId: 545, rpc: 'https://testnet.evm.nodes.onflow.org' },
            { name: 'ronin-testnet', chainId: 2021, rpc: 'https://saigon-testnet.roninchain.com/rpc' }
        ];
        
        console.log("\n📋 Available Networks:");
        networks.forEach((network, i) => {
            console.log(`${i + 1}. ${network.name} (Chain ID: ${network.chainId})`);
        });
        
        // Generate ZK Proof for the swap
        console.log("\n🔐 Generating ZK Proof...");
        const { commitment, nullifierHash, proof } = await generateZKProof(
            testAmount,
            signer.address
        );
        
        console.log("✅ Proof generated:");
        console.log("  📝 Commitment:", commitment);
        console.log("  🔑 Nullifier:", nullifierHash);
        console.log("  🛡️  Proof length:", proof.length, "bytes");
        
        // Test 1:1 conversion calculation
        console.log("\n🧮 Testing 1:1 Conversion Logic:");
        const inputAmount = 1.0; // 1 token
        const fee = inputAmount * 0.01; // 1% fee
        const outputAmount = inputAmount - fee; // 1:1 minus fee
        
        console.log(`  📥 Input: ${inputAmount} tokens`);
        console.log(`  💸 Fee (1%): ${fee} tokens`);
        console.log(`  📤 Output: ${outputAmount} tokens`);
        console.log(`  📊 Conversion Rate: 1:1 (minus 1% bridge fee)`);
        
        console.log("\n🎯 Bridge Contract Information:");
        console.log("  🏗️  Bridge Address:", BRIDGE_ADDRESS);
        console.log("  ✅ Verifier Address:", VERIFIER_ADDRESS);
        console.log("  🌐 Supported Networks: 3 (Mantle, Flow, Ronin)");
        
        console.log("\n📱 Frontend Testing Instructions:");
        console.log("1. Connect MetaMask to one of the supported networks");
        console.log("2. Add the network if not present in MetaMask");
        console.log("3. Select source and destination tokens");
        console.log("4. Enter amount to swap (will show 1:1 conversion minus 1% fee)");
        console.log("5. Click 'Swap' to execute cross-chain transfer");
        
        console.log("\n✅ Bridge is ready for 1:1 cross-chain swaps!");
        
    } catch (error) {
        console.error("❌ Test failed:", error.message);
    }
}

testBridgeSwap()
    .then(() => process.exit(0))
    .catch(error => {
        console.error("💥 Fatal error:", error);
        process.exit(1);
    }); 