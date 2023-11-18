'use client';

import { Slider } from '@/components/ui/slider';
import { initCanvas } from '@/lib/piggy';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';

const PIG_CONTAINER_CLASS = 'pig-container';

export default function Home() {
    const pig = useRef<ReturnType<typeof initCanvas> | null>(null);

    const [coinWorth, setCoinWorth] = useState(50);
    const [balance, setBalance] = useState(100);
    const goal = 1000;

    useEffect(() => { //TODO REMOVE MOCK
        pig.current = initCanvas({
            containerId: PIG_CONTAINER_CLASS,
            width: window.innerWidth,
            height: window.innerHeight,
            startTime: 0,//MOCK
            endTime: 0,//MOCK
            goal: 0, //MOCK
            getBalance: () => 100,//MOCK
            getCoinWorth: () => 5,//MOCK
            onPayment: (amount: number) => {//MOCK
                setBalance((prev) => prev + amount);
            }
        });
    }, []);

    useEffect(() => {
        const handler = () => {
            pig.current?.setDimensions(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handler);
        return () => removeEventListener('resize', handler);
    });

    return (
        <main className="relative h-full">
            <div id={PIG_CONTAINER_CLASS}></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 bg-yellow-300 p-5 flex">
                <div className="relative mr-10">
                    <Image src="/coin.png" alt="Coin" width={80} height={80} />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-black text-4xl">
                        {coinWorth}
                    </div>
                </div>
                <Slider
                    onValueChange={(values: number[]) => {
                        const [n] = values;
                        setCoinWorth(n);
                    }}
                    defaultValue={[coinWorth]} //TODO Balance/2
                    max={100} //TODO Balance
                    step={1} //TODO 0.1
                />
            </div>
        </main>
    );
}
