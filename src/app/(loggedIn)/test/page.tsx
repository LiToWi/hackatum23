'use client';

import { getUser } from '@/service';
import { useWallet } from '@solana/wallet-adapter-react';

export default function TestPage() {
    const wallet = useWallet();

    getUser(wallet).then(console.log);

    return 'Test';
}
