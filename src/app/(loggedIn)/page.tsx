//   import { useAnchorWallet } from '@solana/wallet-adapter-react';
'use client';

import { Slider } from '@/components/ui/slider';
import { initCanvas } from '@/lib/piggy';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';

const PIG_CONTAINER_CLASS = 'pig-container';

export default function Home() {
    const pig = useRef(initCanvas({
        containerId: PIG_CONTAINER_CLASS,
        width: window.innerWidth,
        height: window.innerHeight,
        balance: 50,
        level: 1,
        mood: 5
    }));

    const [coinValue, setCoinValue] = useState(50);

    useEffect(() => {
        const handler = () => {
            pig.current?.setDimensions(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handler);
        return () => removeEventListener('resize', handler);
    });

    return (
        <main className="relative h-full">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 bg-yellow-300 p-5 flex">
                <div className="relative mr-10">
                    <Image src="/coin.png" alt="Coin" width={80} height={80} />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-black text-4xl">
                        {coinValue}
                    </div>
                </div>
                <Slider
                    onValueChange={([n]) => setCoinValue(n)}
                    defaultValue={[coinValue]}
                    max={100}
                    step={1}
                />
            </div>
            <div className={PIG_CONTAINER_CLASS}></div>
        </main>
    );
}
