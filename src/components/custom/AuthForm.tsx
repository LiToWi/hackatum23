'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const css = `
    .wallet-adapter-dropdown {
        display: flex;
        justify-content: center;
    }

    .wallet-adapter-button-trigger {
        background-color: #512da8
    }
`;

export function AuthForm() {
    const wallet = useWallet();
    const router = useRouter();
    const searchParams = useSearchParams();

    console.log(searchParams);

    useEffect(() => {
        if (wallet.connected) {
            router.replace(searchParams.get('redirect') ?? '/');
        }
    }, [router, searchParams, wallet]);

    return (
        <div className="flex flex-col justify-around">
            <style>{css}</style>
            <WalletMultiButton
                onClick={(e) => console.log(e)}
                className="test"
            />
        </div>
    );
}
