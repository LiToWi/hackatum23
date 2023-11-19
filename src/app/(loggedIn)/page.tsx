'use client';

import { NewSaving } from '@/components/custom/NewSaving';
import { Slider } from '@/components/ui/slider';
import { initCanvas } from '@/lib/pigs';
import { Saving, createSaving, getSavings, pay } from '@/service';
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

const PIG_CONTAINER_CLASS = 'pig-container';

export default function Home() {
    const wallet = useWallet();
    const pig = useRef<ReturnType<typeof initCanvas> | null>(null);
    const savings = useRef<Saving[]>([]);
    const saving = savings.current?.[0];
    const [newSavingIsShown, setNewSavingIsShown] = useState(false);
    const [userBalance, setUserBalance] = useState(100);

    const payed =
        saving?.payments.reduce((acc, curr) => acc + curr.amount, 0) ?? 0;
    const remaining = (saving?.goal ?? 0) - payed;

    const coinWorthRef = useRef(remaining / 2);
    const [coinWorth, _setCoinWorth] = useState(coinWorthRef.current);

    const setCoinWorth = (coinWorth: number) => {
        coinWorthRef.current = coinWorth;
        _setCoinWorth(coinWorth);
    };

    const onNewSaving = ({
        name,
        goal,
        date,
    }: {
        name: string;
        goal: number;
        date: DateRange;
    }) => {
        setNewSavingIsShown(false);
        createSaving(wallet, {
            name,
            goal,
            startDate: date.from!,
            paymentDate: date.to!,
        }).then((s) => {
            if (!s) return;
            savings.current!.push(s);
        });
    };

    useEffect(() => {
        getSavings(wallet)
            .then((s) => {
                if (!s) return;

                savings.current = s;
                const saving = s[0];

                setCoinWorth(remaining / 2);

                pig.current = initCanvas({
                    containerId: PIG_CONTAINER_CLASS,
                    width: window.innerWidth,
                    height: window.innerHeight,
                    startTime: saving.startDate,
                    endTime: saving.paymentDate,
                    goal: saving.goal,
                    name: saving.name,
                    payed,
                    savings: s,
                    onAdd: () => setNewSavingIsShown(true),
                    getCoinWorth: () => coinWorthRef.current,
                    onPayment: (amount) => {
                        pay(wallet, saving.id, amount).then((s) => {
                            if (!s) return;
                            savings.current![0] = s;
                            setUserBalance(prev=>prev-amount);
                        });
                    },
                });
            })
            .finally(() => {});
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
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 bg-grey-300 p-5 flex">
                <div className="relative mr-10">
                    <Image src="/coin.png" alt="Coin" width={80} height={80} />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-black text-4xl">
                        {coinWorth}
                    </div>
                </div>
                <Slider
                    onValueChange={([n]: number[]) => setCoinWorth(n)}
                    defaultValue={[coinWorth]}
                    max={userBalance}
                    min={0}
                    step={1}
                />
            </div>
            <NewSaving
                open={newSavingIsShown}
                onClose={() => setNewSavingIsShown(false)}
                onSubmit={onNewSaving}
            ></NewSaving>
        </main>
    );
}
