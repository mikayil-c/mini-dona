# 🚀 MiniDona - Complete Setup & Deployment Guide

This guide will walk you through everything needed to get MiniDona running on your local machine and deployed to Stellar Testnet.

---

## ⏱️ Estimated Time: 1-2 hours

- Setup & Installation: 15 minutes
- Contract Deployment: 10 minutes
- Testing & Verification: 10 minutes
- Making your first donation: 5 minutes

---

## 📋 Pre-Flight Checklist

Before starting, ensure you have:

- [ ] Node.js 18 or higher (`node --version`)
- [ ] npm or yarn (`npm --version`)
- [ ] Rust installed (`rustup` - needed for contract compilation)
- [ ] Freighter Wallet browser extension installed
- [ ] A GitHub account (optional, for repository)

### Install Missing Tools

**Node.js** (if needed):
```bash
# macOS with Homebrew
brew install node

# Or download from https://nodejs.org/
```

**Rust** (if needed):
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
rustup target add wasm32-unknown-unknown
```

**Freighter Wallet**:
1. Go to https://www.freighter.app/
2. Click "Install Extension"
3. Add to your browser
4. Create or import a Stellar account

---

## 🔧 Phase 1: Local Setup (15 minutes)

### Step 1.1: Clone/Download MiniDona

```bash
# Navigate to your projects folder
cd ~/projects

# If cloned from git
git clone https://github.com/yourusername/minidonaa.git
cd minidonaa

# Or if using the existing setup
cd /home/mikayill/soroban/minidonaa
```

### Step 1.2: Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Expected: ✓ Installed ~100 packages in 1-2 minutes
```

Verify installation:
```bash
npm ls
```

You should see:
- `next@14.0.0`
- `react@18.2.0`
- `@stellar/js-sdk@11.0.0`
- `@stellar/freighter-api@1.0.0`
- `tailwindcss@3.3.0`

### Step 1.3: Build Smart Contract

```bash
cd contract

# Build the contract
cargo build --release --target wasm32-unknown-unknown

# ✓ Compiling minidonaa v0.1.0
# ✓ Finished release [optimized] target(s) in 30s
```

Verify the build:
```bash
ls -lh target/wasm32-unknown-unknown/release/minidonaa.wasm
```

Expected: ~150 KB file

### Step 1.4: Set Up Stellar CLI

```bash
# Install Stellar CLI (macOS/Linux)
curl --proto '=https' --tlsv1.2 -sSf https://stellar.org/releases/stellar-cli/install.sh | sh

# Verify installation
stellar --version
# stellar 21.0.0 (or later)
```

### Step 1.5: Configure Stellar CLI Identity

Stellar CLI needs an identity to sign transactions.

**Option A: Use pre-configured identity**
```bash
# If 'alice' already exists in your Stellar config
stellar config identity list
```

**Option B: Create new identity**
```bash
# Generate a new identity (will create random keypair for testnet)
stellar config identity generate alice --network testnet

# Set as default
stellar config identity use alice
```

**Option C: Import from Freighter** (Recommended)
```bash
# Get your secret key from Freighter
# 1. Click Freighter icon
# 2. Settings → Reveal Secret Key
# 3. Copy the secret key (starts with S)

# Then import it:
stellar config identity generate alice --network testnet --secret-key "SABC..."
```

---

## 🌐 Phase 2: Get Testnet XLM (5 minutes)

You need testnet XLM to pay for contract deployment.

### Step 2.1: Get Your Public Key

From Freighter:
1. Click Freighter wallet icon
2. Click on your account name
3. Copy your public key (starts with `G`)

Or from Stellar CLI:
```bash
stellar config identity show alice
```

### Step 2.2: Get Free XLM from Friendbot

Go to: https://laboratory.stellar.org/#account-creator?network=testnet

1. Paste your public key
2. Click "Generate"
3. You'll receive 10,000 testnet XLM

**Wait 1-2 minutes** for the transaction to be confirmed.

### Step 2.3: Verify You Got XLM

```bash
# Check balance on Stellar Expert
open "https://stellar.expert/explorer/testnet/account/YOUR_PUBLIC_KEY"
```

Or via CLI:
```bash
stellar account info --source alice --network testnet
```

---

## 📦 Phase 3: Deploy Smart Contract (10 minutes)

### Step 3.1: Go to Project Root

```bash
cd /home/mikayill/soroban/minidonaa
```

### Step 3.2: Deploy Contract

```bash
stellar contract deploy \
  --wasm contract/target/wasm32-unknown-unknown/release/minidonaa.wasm \
  --source alice \
  --network testnet \
  --alias minidonaa
```

**Expected output:**
```
Installed contract code CAJ...
Contract deployed at: CAJ5GOACGHLLPYWOREVI4TSBSRJYUXSNBEIK26J2O5U6TJPDYGSRTIIQ
```

⚠️ **Important:** Copy the contract ID (the long `CA...` string)

### Step 3.3: Save Contract ID

Create `.env.local` in project root:

```bash
# Windows
type .env.example > .env.local

# macOS/Linux
cp .env.example .env.local

# Then edit the file and add your contract ID
```

Edit `.env.local`:
```
NEXT_PUBLIC_CONTRACT_ID=CAJ5GOACGHLLPYWOREVI4TSBSRJYUXSNBEIK26J2O5U6TJPDYGSRTIIQ
NEXT_PUBLIC_NETWORK=testnet
```

### Step 3.4: Verify Deployment

```bash
# Check on Stellar Expert
open "https://stellar.expert/explorer/testnet/contract/CAJ5GOACGHLLPYWOREVI4TSBSRJYUXSNBEIK26J2O5U6TJPDYGSRTIIQ"

# Or use Stellar CLI
stellar contract inspect --network testnet --id CAJ5GOACGHLLPYWOREVI4TSBSRJYUXSNBEIK26J2O5U6TJPDYGSRTIIQ
```

You should see the three functions:
- `donate`
- `get_total_donated`
- `get_last_donor`

---

## 🎨 Phase 4: Run Frontend (5 minutes)

### Step 4.1: Start Development Server

```bash
# From project root
npm run dev
```

**Expected output:**
```
> next dev
▲ Next.js 14.0.0
- Local:        http://localhost:3000
```

### Step 4.2: Open in Browser

Go to: http://localhost:3000

You should see:
- **MiniDona** logo
- "Connect Freighter Wallet" button
- Welcome message

### Step 4.3: Connect Wallet

1. Click "Connect Freighter Wallet"
2. Freighter popup appears
3. Select your account
4. Click "Approve"
5. **Automatically redirected to donation page**

You should now see:
- Your wallet address (truncated)
- "Disconnect" button
- Donation form
- Statistics sidebar

---

## 🎯 Phase 5: Test Donations (5 minutes)

### Step 5.1: Make a Test Donation

1. **Amount**: Enter `0.5` (XLM)
2. **Category**: Select "Health"
3. **Message**: (Optional) "Test donation"
4. Click **"Send Donation"**

### Step 5.2: Approve in Freighter

1. Freighter popup appears
2. Review transaction details
3. Click "Approve"
4. **Wait 10-30 seconds** for confirmation

### Step 5.3: Verify Success

You should see:
- ✅ Green success message
- Donation amount reset to 1
- "Health" total updated in stats sidebar
- Transaction hash logged

### Step 5.4: Test Multiple Categories

Repeat Step 5.1-5.3 with different categories:
- Education (1 XLM)
- Environment (0.2 XLM)
- Autism Support (0.3 XLM)

Each should:
- Display success message
- Update the correct category in stats
- Show different totals per category

---

## ✅ Verification Checklist

After completing all phases, verify:

- [ ] Contract deployed on testnet
- [ ] Contract ID in `.env.local`
- [ ] Dev server running at localhost:3000
- [ ] Can connect Freighter wallet
- [ ] Can see wallet address
- [ ] Can make donations
- [ ] Stats update after donations
- [ ] Different categories tracked separately
- [ ] Can disconnect wallet
- [ ] Can reconnect wallet

---

## 📊 View Your Data

### On Stellar Expert

Contract page:
```
https://stellar.expert/explorer/testnet/contract/YOUR_CONTRACT_ID
```

Your account page:
```
https://stellar.expert/explorer/testnet/account/YOUR_PUBLIC_KEY
```

### Via CLI

Get total for a category:
```bash
stellar contract invoke \
  --network testnet \
  --id YOUR_CONTRACT_ID \
  --source alice \
  -- get_total_donated \
  --category "Health"
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'next'"

**Solution:**
```bash
rm -rf node_modules
npm install
```

### Issue: "Freighter is not installed"

**Solution:**
1. Install from https://www.freighter.app/
2. Refresh the browser
3. Ensure extension is enabled

### Issue: "Contract not found"

**Solution:**
1. Verify contract ID in `.env.local`
2. Check it matches your deployment
3. Restart dev server: `npm run dev`

### Issue: "Insufficient balance"

**Solution:**
1. Go to https://laboratory.stellar.org/#account-creator
2. Paste public key
3. Click "Generate" to get 10,000 testnet XLM

### Issue: "Transaction timeout"

**Solution:**
1. Network might be slow
2. Wait a few minutes
3. Try again

---

## 🎓 Learning: Understanding the Flow

```
User clicks "Connect" 
    ↓
Freighter prompts for permission
    ↓
We get user's public key
    ↓
Save to localStorage
    ↓
Redirect to /main (donation page)
    ↓
User enters donation amount & category
    ↓
We call contract.donate() 
    ↓
Freighter prompts to sign transaction
    ↓
We submit signed transaction to network
    ↓
Stellar confirms transaction
    ↓
Stats update in real-time
    ↓
Success message displays
```

---

## 🔧 Useful Commands Reference

```bash
# Development
npm run dev                                  # Start dev server
npm run build                               # Build for production
npm run lint                                # Check for errors
npm install                                 # Install dependencies

# Smart Contract
cd contract && cargo build --release --target wasm32-unknown-unknown  # Compile
cargo test                                  # Run tests
cargo clean                                 # Clean build artifacts

# Stellar CLI
stellar contract deploy --help              # See deployment options
stellar contract inspect --network testnet --id CONTRACT_ID
stellar config identity list                # Show identities
stellar account info --source alice --network testnet

# Project Info
npm ls                                      # List dependencies
npm outdated                                # Check for updates
```

---

## 📚 Next Steps

After successful deployment:

1. **Invite others** - Share your app URL
2. **Monitor donations** - Track stats on Stellar Expert
3. **Customize** - Add more categories, update UI
4. **Learn Soroban** - Read official documentation
5. **Deploy to production** - Move to mainnet (later)

---

## 🆘 Getting Help

1. **Check docs**:
   - `README.md` - Overview and features
   - `DEPLOYMENT.md` - Detailed deployment guide
   - `QUICKSTART.md` - Quick commands reference

2. **Community**:
   - Stellar Developers: https://developers.stellar.org/
   - Soroban Discord: https://discord.gg/stellardev
   - GitHub Issues: Create an issue in your repo

3. **Official Docs**:
   - Soroban: https://soroban.stellar.org/docs
   - Stellar SDK: https://developers.stellar.org/docs/build/sdk
   - Freighter API: https://github.com/StellarCN/freighter-api

---

## 🎉 Congratulations!

You've successfully:
- ✅ Set up MiniDona locally
- ✅ Deployed a smart contract to testnet
- ✅ Built and ran a Next.js dApp
- ✅ Integrated Freighter wallet
- ✅ Made real blockchain donations
- ✅ Verified data on-chain

**You're now a blockchain developer! 🚀**

---

**Last Updated:** October 2025
**MiniDona Version:** 0.1.0
**Stellar Network:** Testnet
