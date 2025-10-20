import type { Metadata } from "next";
import { WalletProvider } from "@/context/WalletContext";
import "./globals.css";

export const metadata: Metadata = {
    title: "MiniDona - Minimal Donations",
    description: "A lightweight donation dApp on Stellar Soroban",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-gray-900 text-white">
                <WalletProvider>
                    {children}
                </WalletProvider>
            </body>
        </html>
    );
}
