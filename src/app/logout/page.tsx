'use client';

import { useWallet } from '@solana/wallet-adapter-react';

export default function LogoutPage() {
    const wallet = useWallet();
    wallet.disconnect();

    return <p>You&apos;ve been logged out</p>;
}
