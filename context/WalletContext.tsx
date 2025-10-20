'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
    publicKey: string | null;
    isConnected: boolean;
    isLoading: boolean;
    error: string | null;
    connect: () => Promise<void>;
    disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initializeWallet = async () => {
            try {
                // Check localStorage first
                const savedKey = localStorage.getItem('walletPublicKey');
                if (savedKey) {
                    setPublicKey(savedKey);
                    setIsConnected(true);
                    return;
                }

                // Try to get Freighter's current key (without popup)
                const freighter = (window as any).freighterApi;
                if (freighter && freighter.getPublicKey) {
                    try {
                        const currentKey = await freighter.getPublicKey();
                        if (currentKey) {
                            console.log('[FREIGHTER] Auto-detected key:', currentKey);
                            localStorage.setItem('walletPublicKey', currentKey);
                            setPublicKey(currentKey);
                            setIsConnected(true);
                            return;
                        }
                    } catch (err) {
                        console.log('[FREIGHTER] getPublicKey not available or user not connected');
                    }
                }
            } catch (err) {
                console.error('Wallet initialization error:', err);
            }
        };

        initializeWallet();
    }, []);

    const connect = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Access Freighter from window
            const freighter = (window as any).freighterApi;

            if (freighter) {
                // Real Freighter wallet installed
                try {
                    const { address, error: accessError } = await freighter.requestAccess();

                    if (accessError) {
                        setError(accessError);
                        return;
                    }

                    if (!address) {
                        setError('Failed to get address from Freighter');
                        return;
                    }

                    localStorage.setItem('walletPublicKey', address);
                    setPublicKey(address);
                    setIsConnected(true);
                    return;
                } catch (err) {
                    // Freighter exists but connection failed
                    console.error('Freighter connection error:', err);
                }
            }

            // Demo mode: Use simulated wallet
            console.log('[DEMO] Using simulated wallet for testing');
            const demoAddress = 'GDI3LYRDG47TIU4JFDIUZLSPI7CQ4M7JAG25R5ZIP3ITWQZALYQXHHAR';
            localStorage.setItem('walletPublicKey', demoAddress);
            setPublicKey(demoAddress);
            setIsConnected(true);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Connection failed';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const disconnect = () => {
        localStorage.removeItem('walletPublicKey');
        setPublicKey(null);
        setIsConnected(false);
        setError(null);
    };

    return (
        <WalletContext.Provider value={{ publicKey, isConnected, isLoading, error, connect, disconnect }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within WalletProvider');
    }
    return context;
};