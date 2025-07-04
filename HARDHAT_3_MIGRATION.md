# Hardhat 2.25.0 + Ethers v6 Migration Guide

This guide explains the changes made to upgrade from Hardhat 2.9 + Ethers v5 to Hardhat 2.25.0 + Ethers v6.

## Why Not Hardhat 3?

While Hardhat 3 offers exciting new features, it's still in alpha and has dependency conflicts. We're using the stable approach:
- **Hardhat 2.25.0** (latest stable)
- **Ethers v6** with compatible plugins
- **Modern tooling** without alpha instability

## Installation Steps (Stable Approach)

1. **Clear npm cache and remove node_modules:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
```

2. **Install the updated packages:**
```bash
npm install --legacy-peer-deps
```

## Key Changes Made

### 1. Package.json Updates

**Updated to stable versions:**
- `hardhat`: `^2.9.0` → `^2.25.0` (latest stable)
- `@nomicfoundation/hardhat-ethers`: `^3.0.9` (ethers v6 support)
- `ethers`: `^5.7.2` → `^6.13.4`

**Removed deprecated packages:**
- `@nomiclabs/hardhat-ethers` → `@nomicfoundation/hardhat-ethers`
- `@nomiclabs/hardhat-waffle` → `@nomicfoundation/hardhat-chai-matchers`
- `ethereum-waffle` (no longer needed)

### 2. Hardhat Config Changes

**Old imports:**
```javascript
require("@nomiclabs/hardhat-waffle");
```

**New imports:**
```javascript
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");
```

### 3. Ethers.js v5 → v6 Migration

**Provider changes:**
```javascript
// v5
new ethers.providers.Web3Provider(provider)

// v6
new ethers.BrowserProvider(provider)
```

**Signer changes:**
```javascript
// v5
const signer = provider.getSigner()

// v6
const signer = await provider.getSigner()
```

**Utility functions:**
```javascript
// v5
ethers.utils.parseEther(amount)
ethers.utils.formatEther(amount)
ethers.utils.keccak256(data)
ethers.utils.defaultAbiCoder.encode()

// v6
ethers.parseEther(amount)
ethers.formatEther(amount)
ethers.keccak256(data)
ethers.AbiCoder.defaultAbiCoder().encode()
```

## Benefits of This Approach

- **Stability**: Using proven stable versions
- **Modern Ethers**: Access to ethers v6 features and security
- **Better Performance**: Improved from Hardhat 2.21+ with EDR (Rust runtime)
- **Future-Ready**: Easy upgrade path to Hardhat 3 when it's stable
- **No Dependency Conflicts**: Smooth installation process

## Testing Your Migration

After migration, test your setup:

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to a test network
npx hardhat run scripts/deploy-multichain.js --network sepolia
```

## When to Consider Hardhat 3

Consider upgrading to Hardhat 3 when:
- It reaches stable release (not alpha/beta)
- Plugin ecosystem is fully compatible
- Your project can handle potential breaking changes

## Troubleshooting

**Common Issues:**

1. **Dependency conflicts**: Use `--legacy-peer-deps` flag
2. **Signer errors**: Make sure to `await` signer calls in ethers v6
3. **Utils not found**: Replace `ethers.utils.*` with direct ethers methods
4. **Provider errors**: Use `BrowserProvider` instead of `Web3Provider`
5. **ABI Coder**: Use `ethers.AbiCoder.defaultAbiCoder()` instead of `ethers.utils.defaultAbiCoder`

**If installation fails:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
```

This approach gives you modern tooling with proven stability! 