'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { usePathname, useRouter } from 'next/navigation';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const wallet = useWallet();
    const router = useRouter();
    const pathName = usePathname();

    if (!wallet.wallet) {
        router.replace(`/login?${new URLSearchParams({ redirect: pathName })}`);
    }

    return children;
}
