#!/bin/bash

# MiniDona Deployment Checklist
# Run this to verify everything is ready

echo "🎉 MiniDona - Pre-Deployment Checklist"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "   Please run this script from the minidonaa directory"
    exit 1
fi

# Verify key files exist
echo "📋 Checking files..."
files=(
    "package.json"
    "tsconfig.json"
    "next.config.js"
    "tailwind.config.js"
    ".env.example"
    "contract/Cargo.toml"
    "contract/src/lib.rs"
    "app/layout.tsx"
    "app/page.tsx"
    "app/main/page.tsx"
    "context/WalletContext.tsx"
    "lib/soroban.ts"
    "SETUP.md"
    "README.md"
    "DEPLOYMENT.md"
    "QUICKSTART.md"
)

missing=0
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file"
        missing=$((missing + 1))
    fi
done

echo ""

# Check prerequisites
echo "🔧 Checking prerequisites..."

if command -v node &> /dev/null; then
    node_version=$(node -v)
    echo "  ✅ Node.js: $node_version"
else
    echo "  ❌ Node.js not installed"
fi

if command -v cargo &> /dev/null; then
    echo "  ✅ Rust/Cargo installed"
else
    echo "  ❌ Rust not installed"
fi

if command -v stellar &> /dev/null; then
    echo "  ✅ Stellar CLI installed"
else
    echo "  ⚠️  Stellar CLI not installed (needed for deployment)"
fi

if [ -f ".env.local" ]; then
    if grep -q "NEXT_PUBLIC_CONTRACT_ID=" ".env.local"; then
        contract_id=$(grep "NEXT_PUBLIC_CONTRACT_ID=" .env.local | cut -d'=' -f2)
        if [ -z "$contract_id" ]; then
            echo "  ⚠️  .env.local exists but CONTRACT_ID is empty"
        else
            echo "  ✅ .env.local has CONTRACT_ID: ${contract_id:0:8}..."
        fi
    fi
else
    echo "  ⚠️  .env.local not created (copy from .env.example)"
fi

echo ""

# Summary
echo "📊 Summary:"
echo "==========="
echo "Files OK: $((${#files[@]} - missing))/${#files[@]}"
echo ""

if [ $missing -eq 0 ]; then
    echo "✅ All files present!"
else
    echo "❌ $missing files missing"
fi

echo ""
echo "📚 Next steps:"
echo "1. npm install           (Install dependencies)"
echo "2. cd contract && cargo build --release --target wasm32-unknown-unknown"
echo "3. stellar contract deploy ... (Deploy contract)"
echo "4. Update .env.local with CONTRACT_ID"
echo "5. npm run dev           (Start dev server)"
echo ""
echo "📖 For detailed help, read: SETUP.md"
echo ""
