#!/bin/bash

# MiniDona Contract Testing Script
# This script helps test the deployed contract

set -e

echo "🧪 MiniDona Contract Testing Script"
echo "===================================="
echo ""

# Check environment
if [ -z "$NEXT_PUBLIC_CONTRACT_ID" ]; then
    echo "❌ Error: NEXT_PUBLIC_CONTRACT_ID not set in .env.local"
    echo "Please set your contract ID first:"
    echo "  NEXT_PUBLIC_CONTRACT_ID=your_contract_id"
    exit 1
fi

CONTRACT_ID=$NEXT_PUBLIC_CONTRACT_ID
NETWORK="testnet"

echo "📋 Contract Information:"
echo "   Contract ID: $CONTRACT_ID"
echo "   Network: $NETWORK"
echo ""

# Function to inspect contract
inspect_contract() {
    echo "🔍 Inspecting contract..."
    stellar contract inspect --network $NETWORK --id $CONTRACT_ID
}

# Function to get total donations
get_total() {
    CATEGORY=$1
    echo "📊 Getting total donations for: $CATEGORY"
    
    stellar contract invoke \
      --network $NETWORK \
      --id $CONTRACT_ID \
      --source alice \
      -- get_total_donated \
      --category "$CATEGORY"
}

# Function to get last donor
get_donor() {
    CATEGORY=$1
    echo "👤 Getting last donor for: $CATEGORY"
    
    stellar contract invoke \
      --network $NETWORK \
      --id $CONTRACT_ID \
      --source alice \
      -- get_last_donor \
      --category "$CATEGORY"
}

# Main menu
echo "Select an action:"
echo "1) Inspect contract"
echo "2) Get total donations for Health"
echo "3) Get total donations for Education"
echo "4) Get total donations for Environment"
echo "5) Get total donations for Autism Support"
echo "6) Get last donor for a category"
echo "7) View on Stellar Expert"
echo ""
read -p "Enter choice (1-7): " choice

case $choice in
    1)
        inspect_contract
        ;;
    2)
        get_total "Health"
        ;;
    3)
        get_total "Education"
        ;;
    4)
        get_total "Environment"
        ;;
    5)
        get_total "Autism Support"
        ;;
    6)
        read -p "Enter category name: " category
        get_donor "$category"
        ;;
    7)
        echo "Opening in browser..."
        open "https://stellar.expert/explorer/testnet/contract/$CONTRACT_ID"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "✅ Done!"
