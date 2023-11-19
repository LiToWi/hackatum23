import idl from '@/idl.json';
import { AnchorProvider, Program, web3 } from '@coral-xyz/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

const PREFLIGHT_COMMITMENT = 'processed';

const programId = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID);
const userMint = new web3.PublicKey(process.env.NEXT_PUBLIC_USER_MINT);

export type User = {
    accounts: number;
};

export type Payment = {
    amount: number;
    date: Date;
    id: number;
};

export type Saving = {
    accessible: boolean;
    staking: boolean;
    accountBalance: number;
    paymentDate: Date;
    startDate: Date;
    goal: number;
    name: string;
    id: number;
    payments: Payment[];
};

type StoredSaving = Omit<Saving, 'payments' | 'paymentDate' | 'startDate'> & {
    datesOfPayments: number[];
    amountsOfPayments: number[];
    paymentDate: number;
    startDate: number;
};

function getProgram(wallet: WalletContextState) {
    const network = clusterApiUrl('devnet');
    const connection = new Connection(network, PREFLIGHT_COMMITMENT);

    const provider = new AnchorProvider(
        connection,
        // @ts-ignore
        wallet,
        // @ts-ignore
        PREFLIGHT_COMMITMENT
    );

    const [userAccountPublicKey] = web3.PublicKey.findProgramAddressSync(
        [
            Buffer.from('user2'),
            wallet.publicKey!.toBuffer(),
            userMint.toBuffer(),
        ], // USD Coin
        programId
    );

    return {
        userAccountPublicKey,
        // @ts-ignore
        program: new Program(idl, programId, provider),
    };
}

export async function getUser(wallet: WalletContextState) {
    const { program, userAccountPublicKey } = getProgram(wallet);

    try {
        const accountInfo = await program.provider.connection.getAccountInfo(
            userAccountPublicKey
        );

        // create user if not available
        if (accountInfo == null || accountInfo.lamports == undefined) {
            const txHash = await program.methods
                .userInit()
                .accounts({
                    owner: wallet.publicKey!,
                    systemProgram: web3.SystemProgram.programId,
                    user: userAccountPublicKey,
                    usersMint: userMint,
                })
                .rpc({ skipPreflight: true });

            await program.provider.connection.confirmTransaction(txHash);
        }

        const userAccount = await program.account.user.fetch(
            userAccountPublicKey
        );

        return userAccount as User;
    } catch {
        return null;
    }
}

const mock = {
    accessible: true,
    staking: true,
    accountBalance: 50,
    paymentDate: new Date(),
    startDate: new Date(),
    goal: 1000,
    name: 'test',
    id: 0,
    payments: [{ amount: 0, date: new Date(), id: 0 }],
} satisfies Saving;

export async function getSavings(wallet): Promise<Saving[] | null> {
    return Promise.resolve([mock]);
}

export function createSaving(wallet, saving: Saving): Saving | null {
    return null;
}

export async function pay(
    wallet,
    id: number,
    amount: number
): Promise<Saving | null> {
    return Promise.resolve(mock);
}

export function retrieve(): boolean {
    return true;
}
