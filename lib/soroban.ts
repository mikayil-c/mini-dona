/**
 * Soroban Contract Integration - Demo/Placeholder Mode
 * 
 * This file contains placeholder utilities to interact with the MiniDona smart contract.
 * In production, this would use the Stellar JS SDK via CDN or after deployment.
 * 
 * SETUP: To use with real Stellar SDK, add the following to public/index.html:
 * <script src="https://cdn.jsdelivr.net/npm/stellar-sdk@latest"></script>
 * <script src="https://cdn.jsdelivr.net/npm/@stellar/freighter-api@latest"></script>
 */

// Contract ID (update after deployment to testnet)
export const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID || '';

// Demo data storage (for testing without contract)
const demoData: Record<string, any> = {
    donations: {},
    totalDonated: 0,
};

/**
 * Get account details from Horizon (demo version)
 */
export async function getAccountDetails(publicKey: string) {
    console.log('[DEMO] Getting account details for:', publicKey);
    return {
        sequence: '1000',
        balances: [
            { balance: '100.0', asset_type: 'native' }
        ],
    };
}

/**
 * Invoke contract method: donate (demo version)
 * In production, this would build and sign a real transaction
 */
export async function donate(
    publicKey: string,
    amount: string,
    category: string
): Promise<any> {
    try {
        console.log('[DEMO] Processing donation:', { publicKey, amount, category });

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // In demo mode, just track locally
        const key = `${category}_donations`;
        if (!demoData.donations[key]) {
            demoData.donations[key] = [];
        }

        demoData.donations[key].push({
            donor: publicKey,
            amount: parseFloat(amount),
            category,
            timestamp: new Date().toISOString(),
        });

        demoData.totalDonated = (demoData.totalDonated || 0) + parseFloat(amount);

        const result = {
            status: 'success',
            message: `Demo: ${amount} XLM donated to ${category}`,
            hash: `demo_${Date.now()}`,
            donor: publicKey,
            amount,
            category,
        };

        console.log('[DEMO] Donation result:', result);
        return result;
    } catch (err) {
        console.error('[DEMO] Donate error:', err);
        throw err;
    }
}

/**
 * Query contract method: get_total_donated (demo version)
 * Returns total donations for a category
 */
export async function getTotalDonated(category: string): Promise<number> {
    try {
        console.log('[DEMO] Getting total donated for category:', category);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const key = `${category}_donations`;
        const donations = demoData.donations[key] || [];
        const total = donations.reduce((sum: number, d: any) => sum + d.amount, 0);

        console.log('[DEMO] Total for', category, ':', total);
        return total;
    } catch (err) {
        console.error('[DEMO] Failed to get total donated:', err);
        return 0;
    }
}

/**
 * Query contract method: get_last_donor (demo version)
 * Returns the address of the last donor for a category
 */
export async function getLastDonor(category: string): Promise<string | null> {
    try {
        console.log('[DEMO] Getting last donor for category:', category);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const key = `${category}_donations`;
        const donations = demoData.donations[key] || [];

        if (donations.length === 0) {
            return null;
        }

        const lastDonor = donations[donations.length - 1].donor;
        console.log('[DEMO] Last donor for', category, ':', lastDonor);
        return lastDonor;
    } catch (err) {
        console.error('[DEMO] Failed to get last donor:', err);
        return null;
    }
}

/**
 * Wait for transaction to be confirmed on network (demo version)
 */
export async function waitForTransaction(hash: string, _maxAttempts: number = 5): Promise<any> {
    console.log('[DEMO] Simulating transaction confirmation for hash:', hash);

    // In demo mode, just return success immediately
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        hash,
        confirmed: true,
        status: 'success',
    };
}
