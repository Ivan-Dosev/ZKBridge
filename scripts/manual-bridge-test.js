const { ethers } = require("hardhat");
require('dotenv').config();

// Import the ZK proof generation function
const { generateZKProof } = require("./zkp-node");

async function manualBridgeTest() {
    console.log("🌉 Starting Manual Bridge Test");
    console.log("=====================================");
    
    try {
        // Network configurations
        const networks = {
            mantle: {
                name: "Mantle Sepolia",
                rpc: "https://rpc.sepolia.mantle.xyz",
                bridgeAddress: "0x6Ba4f5b055C57BAd4C05eC0E45Ac078c5E59d9C9",
                chainId: 5003
            },
            ronin: {
                name: "Ronin Testnet", 
                rpc: "https://saigon-testnet.roninchain.com/rpc",
                bridgeAddress: "0xE0aE21dE80e2cB9878f2c56E84A538bDbCBE8eab",
                chainId: 2021
            }
        };

        // Test parameters
        const testAmount = ethers.parseEther("0.001"); // 0.001 ETH
        console.log(`💰 Test Amount: ${ethers.formatEther(testAmount)} ETH`);

        // Load wallet
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
        console.log(`👛 Wallet Address: ${wallet.address}`);

        // Connect to Mantle Sepolia (source chain)
        console.log(`\n🔗 Connecting to ${networks.mantle.name}...`);
        const mantleProvider = new ethers.JsonRpcProvider(networks.mantle.rpc);
        const mantleWallet = wallet.connect(mantleProvider);
        
        // Check balance on Mantle
        const mantleBalance = await mantleProvider.getBalance(wallet.address);
        console.log(`💳 Mantle Balance: ${ethers.formatEther(mantleBalance)} MNT`);
        
        if (mantleBalance < testAmount) {
            throw new Error(`❌ Insufficient balance on Mantle. Need ${ethers.formatEther(testAmount)} MNT`);
        }

        // Load bridge contract ABI
        const bridgeABI = require("../artifacts/contracts/BridgeWithZKP.sol/BridgeWithZKP.json").abi;
        
        // Create bridge contract instance for Mantle
        const mantleBridge = new ethers.Contract(
            networks.mantle.bridgeAddress,
            bridgeABI,
            mantleWallet
        );

        console.log(`📋 Mantle Bridge Address: ${networks.mantle.bridgeAddress}`);

        // Generate ZK proof
        console.log("\n🔒 Generating ZK Proof...");
        const { commitment, nullifierHash, proof } = await generateZKProof(
            testAmount,
            wallet.address
        );
        
        console.log(`✅ Commitment: ${commitment}`);
        console.log(`✅ Nullifier Hash: ${nullifierHash}`);
        console.log(`✅ Proof Length: ${proof.length} bytes`);

        // Step 1: Deposit on Mantle Sepolia
        console.log(`\n📤 Step 1: Depositing ${ethers.formatEther(testAmount)} MNT on Mantle Sepolia...`);
        
        // Estimate gas first
        console.log("⛽ Estimating gas for deposit...");
        const estimatedGas = await mantleBridge.deposit.estimateGas(commitment, {
            value: testAmount
        });
        console.log(`📊 Estimated gas: ${estimatedGas.toString()}`);
        
        // Get current gas price
        const gasPrice = await mantleProvider.getFeeData();
        console.log(`💰 Gas price: ${gasPrice.gasPrice?.toString()} wei`);
        
        const depositTx = await mantleBridge.deposit(commitment, {
            value: testAmount,
            gasLimit: estimatedGas * 2n, // Double the estimated gas for safety
            gasPrice: gasPrice.gasPrice
        });
        
        console.log(`🔄 Deposit Transaction Hash: ${depositTx.hash}`);
        console.log("⏳ Waiting for confirmation...");
        
        const depositReceipt = await depositTx.wait();
        console.log(`✅ Deposit confirmed in block: ${depositReceipt.blockNumber}`);

        // Check bridge balance on Mantle
        const mantleBridgeBalance = await mantleProvider.getBalance(networks.mantle.bridgeAddress);
        console.log(`🏦 Mantle Bridge Balance: ${ethers.formatEther(mantleBridgeBalance)} MNT`);

        // Wait for some confirmations
        console.log("\n⏰ Waiting 30 seconds for network confirmations...");
        await new Promise(resolve => setTimeout(resolve, 30000));

        // Step 2: Connect to Ronin Testnet (target chain)
        console.log(`\n🔗 Connecting to ${networks.ronin.name}...`);
        const roninProvider = new ethers.JsonRpcProvider(networks.ronin.rpc);
        const roninWallet = wallet.connect(roninProvider);

        // Check initial balance on Ronin
        const initialRoninBalance = await roninProvider.getBalance(wallet.address);
        console.log(`💳 Initial Ronin Balance: ${ethers.formatEther(initialRoninBalance)} RON`);

        // Create bridge contract instance for Ronin
        const roninBridge = new ethers.Contract(
            networks.ronin.bridgeAddress,
            bridgeABI,
            roninWallet
        );

        console.log(`📋 Ronin Bridge Address: ${networks.ronin.bridgeAddress}`);

        // Check bridge balance on Ronin
        const roninBridgeBalance = await roninProvider.getBalance(networks.ronin.bridgeAddress);
        console.log(`🏦 Ronin Bridge Balance: ${ethers.formatEther(roninBridgeBalance)} RON`);

        if (roninBridgeBalance < testAmount) {
            throw new Error(`❌ Insufficient liquidity on Ronin bridge. Available: ${ethers.formatEther(roninBridgeBalance)} RON`);
        }

        // Step 3: Withdraw on Ronin Testnet
        console.log(`\n📥 Step 2: Withdrawing ${ethers.formatEther(testAmount)} RON on Ronin Testnet...`);
        
        const withdrawTx = await roninBridge.withdraw(
            testAmount,
            wallet.address,
            nullifierHash,
            proof,
            { gasLimit: 1000000 } // Increased gas limit
        );

        console.log(`🔄 Withdrawal Transaction Hash: ${withdrawTx.hash}`);
        console.log("⏳ Waiting for confirmation...");

        const withdrawReceipt = await withdrawTx.wait();
        console.log(`✅ Withdrawal confirmed in block: ${withdrawReceipt.blockNumber}`);

        // Check final balance on Ronin
        const finalRoninBalance = await roninProvider.getBalance(wallet.address);
        console.log(`💳 Final Ronin Balance: ${ethers.formatEther(finalRoninBalance)} RON`);
        
        const received = finalRoninBalance - initialRoninBalance;
        console.log(`📈 Amount Received: ${ethers.formatEther(received)} RON`);

        console.log("\n🎉 BRIDGE TEST COMPLETED SUCCESSFULLY! 🎉");
        console.log("=====================================");
        console.log(`✅ Deposited: ${ethers.formatEther(testAmount)} MNT on Mantle`);
        console.log(`✅ Received: ${ethers.formatEther(received)} RON on Ronin`);
        console.log(`🔗 Deposit TX: https://sepolia.mantle.xyz/tx/${depositTx.hash}`);
        console.log(`🔗 Withdraw TX: https://saigon-explorer.roninchain.com/tx/${withdrawTx.hash}`);

    } catch (error) {
        console.error("\n❌ BRIDGE TEST FAILED!");
        console.error("Error:", error.message);
        
        if (error.code) {
            console.error("Error Code:", error.code);
        }
        
        if (error.reason) {
            console.error("Error Reason:", error.reason);
        }
        
        process.exit(1);
    }
}

// Run the test
manualBridgeTest()
    .then(() => {
        console.log("\n✅ Test completed successfully!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Test failed:", error);
        process.exit(1);
    }); 