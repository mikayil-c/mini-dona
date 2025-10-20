'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/context/WalletContext';
import { donate, getTotalDonated } from '@/lib/soroban';

const DONATION_CATEGORIES = [
    'Health',
    'Education',
    'Environment',
    'Autism Support',
];

export default function MainPage() {
    const router = useRouter();
    const { publicKey, isConnected, disconnect } = useWallet();

    const [amount, setAmount] = useState('1');
    const [category, setCategory] = useState(DONATION_CATEGORIES[0]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [totals, setTotals] = useState<Record<string, number>>({});

    // Redirect if not connected
    useEffect(() => {
        if (!isConnected || !publicKey) {
            router.push('/');
        }
    }, [isConnected, publicKey, router]);

    // Load totals
    useEffect(() => {
        const loadTotals = async () => {
            const newTotals: Record<string, number> = {};
            for (const cat of DONATION_CATEGORIES) {
                try {
                    const total = await getTotalDonated(cat);
                    newTotals[cat] = total;
                } catch (err) {
                    console.error(`Failed to load total for ${cat}:`, err);
                    newTotals[cat] = 0;
                }
            }
            setTotals(newTotals);
        };

        loadTotals();
        const interval = setInterval(loadTotals, 10000); // Refresh every 10s
        return () => clearInterval(interval);
    }, []);

    const handleDonate = async () => {
        try {
            setError(null);
            setSuccess(null);
            setIsLoading(true);

            if (!publicKey) {
                throw new Error('Wallet not connected');
            }

            if (!amount || parseFloat(amount) <= 0) {
                throw new Error('Invalid donation amount');
            }

            // Call contract
            const result = await donate(publicKey, amount, category);

            setSuccess(`Donation of ${amount} XLM to ${category} successful! Hash: ${result.hash || 'pending'}`);
            setAmount('1');
            setMessage('');

            // Refresh totals after a delay
            setTimeout(async () => {
                const newTotals: Record<string, number> = {};
                for (const cat of DONATION_CATEGORIES) {
                    try {
                        const total = await getTotalDonated(cat);
                        newTotals[cat] = total;
                    } catch (err) {
                        newTotals[cat] = 0;
                    }
                }
                setTotals(newTotals);
            }, 2000);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Donation failed';
            setError(errorMsg);
            console.error('Donation error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisconnect = () => {
        disconnect();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
            {/* Header */}
            <div className="max-w-2xl mx-auto mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-white">MiniDona</h1>
                        <p className="text-blue-300 text-sm mt-1">Connected: {publicKey?.slice(0, 8)}...</p>
                    </div>
                    <button
                        onClick={handleDisconnect}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Disconnect
                    </button>
                </div>
            </div>

            <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Donation Form */}
                <div className="md:col-span-2">
                    <div className="bg-gray-800 rounded-lg shadow-2xl p-6 border border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-6">Make a Donation</h2>

                        {/* Error message */}
                        {error && (
                            <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-4 text-red-100">
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        {/* Success message */}
                        {success && (
                            <div className="bg-green-900 border border-green-700 rounded-lg p-4 mb-4 text-green-100">
                                <p className="text-sm">{success}</p>
                            </div>
                        )}

                        {/* Amount Input */}
                        <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-bold mb-2">
                                Amount (XLM)
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                disabled={isLoading}
                                min="0.1"
                                step="0.1"
                                className="w-full"
                                placeholder="0.0"
                            />
                        </div>

                        {/* Category Dropdown */}
                        <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-bold mb-2">
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                disabled={isLoading}
                                className="w-full"
                            >
                                {DONATION_CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Message Input */}
                        <div className="mb-6">
                            <label className="block text-gray-300 text-sm font-bold mb-2">
                                Message (optional)
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                disabled={isLoading}
                                className="w-full resize-none"
                                rows={3}
                                placeholder="Leave a message..."
                            />
                        </div>

                        {/* Donate Button */}
                        <button
                            onClick={handleDonate}
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                        >
                            {isLoading ? 'Processing...' : 'Send Donation'}
                        </button>
                    </div>
                </div>

                {/* Stats Sidebar */}
                <div className="md:col-span-1">
                    <div className="bg-gray-800 rounded-lg shadow-2xl p-6 border border-gray-700">
                        <h3 className="text-xl font-bold text-white mb-4">Donation Totals</h3>
                        <div className="space-y-4">
                            {DONATION_CATEGORIES.map((cat) => (
                                <div key={cat} className="bg-gray-700 rounded-lg p-4">
                                    <p className="text-gray-300 text-sm">{cat}</p>
                                    <p className="text-2xl font-bold text-blue-400">
                                        {(totals[cat] || 0).toFixed(2)} XLM
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Info */}
                        <div className="mt-6 pt-6 border-t border-gray-700">
                            <p className="text-xs text-gray-400">
                                💡 Donations are tracked by category on the smart contract. All donations are transparent and immutable.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="max-w-2xl mx-auto mt-12 text-center text-gray-400 text-sm">
                <p>🌍 Building impact with Stellar Soroban</p>
            </div>
        </div>
    );
}
