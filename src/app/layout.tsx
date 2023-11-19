import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Wallet } from '@/components/Wallet';
import clsx from 'clsx';

const inter = Inter({ subsets: ['latin'] });

// TODO: Fill in metadata
export const metadata: Metadata = {
    title: 'Porkfolio',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="h-full">
            <body className={clsx(inter.className, 'h-screen w-screen')}>
                <Wallet>{children}</Wallet>
            </body>
        </html>
    );
}
