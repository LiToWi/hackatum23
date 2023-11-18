import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// TODO: Fill in metadata
export const metadata: Metadata = {
    title: 'NAME',
    description: 'FILL',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="de">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
