'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/context/WalletContext';

export default function ConnectPage() {
    const router = useRouter();
    const { publicKey, isConnected, isLoading, error, connect } = useWallet();

    // Redirect to /main if already connected
    useEffect(() => {
        if (isConnected && publicKey) {
            router.push('/main');
        }
    }, [isConnected, publicKey, router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-2">MiniDona</h1>
                    <p className="text-blue-300 text-lg">Stellar Soroban Donations</p>
                </div>

                {/* Card */}
                <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">
                    <div className="text-center mb-8">
                        <div className="bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">💰</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Welcome</h2>
                        <p className="text-gray-300">Connect your wallet to make donations</p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6 text-red-100">
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {/* Connect button */}
                    <button
                        onClick={connect}
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                        {isLoading ? 'Connecting...' : 'Connect Freighter Wallet'}
                    </button>

                    {/* Info */}
                    <p className="text-xs text-gray-400 text-center mt-6">
                        This app uses Freighter Wallet to sign transactions on Stellar Testnet
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-gray-400 text-sm">
                    <p>Make quick, meaningful donations with Stellar Soroban</p>
                </div>
            </div>
        </div>
    );
}
