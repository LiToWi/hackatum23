'use client';

import { pay, getUser, Saving, getSavings, createSaving } from '@/service';
import { useWallet } from '@solana/wallet-adapter-react';
import {useEffect, useRef} from "react";

export default function TestPage() {
    const wallet = useWallet();
    const test_savings: Saving = {paymentDate: new Date(Date.now() + 20000), startDate: new Date(Date.now()),
        name: "some_saving_account", goal: 5000, accessible: false, staking: false, id: 0, payments: [], accountBalance: 0, paid: 0};

    createSaving(wallet, {goal: 200, name: " ", startDate: new Date(0), paymentDate: new Date(5000)})
        .then(sav => {console.log("sav", sav); console.log("sav.id ", sav?.id); pay(wallet, sav?.id??0,100)
            .then(b => {console.log(b); console.log(getSavings(wallet))})})

    //const a = useRef(0);
    //useEffect(() => {
    //    if(!wallet || a.current) return
    //    a.current = 1
    //    console.log('asdf',wallet)
    //    createSaving(wallet, test_savings)
    //}, [wallet]);

    //useEffect(() => {
    //    setTimeout(() => {
    //    getSavings(wallet).then(console.log)
    //    console.log('pk', wallet.publicKey)
//
    //    },3000)
    //}, [wallet.publicKey]);


    // getUser(wallet).then(console.log);
    return 'Test';
}
