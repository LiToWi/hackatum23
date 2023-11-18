'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { usePathname, useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const wallet = useWallet();
    const router = useRouter();
    const pathName = usePathname();

    if (!wallet.wallet) {
        router.replace(
            `/login?${
                pathName === '/'
                    ? ''
                    : new URLSearchParams({ redirect: pathName })
            }`
        );
    }

    return wallet.wallet ? (
        children
    ) : (
        <div className="flex justify-center items-center h-full">
            <Icons.spinner className="animate-spin w-52 h-52"></Icons.spinner>
        </div>
    );
}
