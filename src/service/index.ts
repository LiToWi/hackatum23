import idl from '@/idl.json';
import {AnchorProvider, BN, Program, web3} from '@coral-xyz/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import {readUInt} from "image-size/dist/readUInt";

const PREFLIGHT_COMMITMENT = 'processed';

const programId = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID);
const userMint = new web3.PublicKey(process.env.NEXT_PUBLIC_USER_MINT);
let mock_saving_state

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
    paid: number;
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
        [ Buffer.from('user2'),
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
    if (wallet.publicKey == null) {
        return wallet.publicKey;
    }
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

        return {accounts: userAccount.anzahl as number} as User;
    } catch {
        return null;
    }
}

const mock = {
    accessible: true,
    staking: true,
    paymentDate: new Date(),
    startDate: new Date(),
    goal: 1000,
    name: 'test',
    id: 0,
    payments: [{ amount: 0, date: new Date(), id: 0 }],
    paid: 0,
    accountBalance: 0
} satisfies Saving;

// to mock, change the content here
export async function getSavings(wallet: WalletContextState): Promise<Saving[] | null> {
    // return mock_getSavings(wallet);
    return blockchain_getSavings(wallet);
}
export async function createSaving(wallet: WalletContextState, saving:
    Pick<Saving, 'goal' | 'name' | 'startDate' | 'paymentDate'>): Promise<Saving | null> {
    // return mock_createSaving(wallet, saving);
    return blockchain_createSaving(wallet, saving);
}
export async function pay(wallet: WalletContextState, id: number, amount: number) {
    // return mock_pay(wallet, id, amount);
    return blockchain_pay(wallet, amount, id);
}

export async function mock_getSavings(wallet: WalletContextState): Promise<Saving[] | null> {
    return Promise.resolve([mock]);
}

export async function mock_createSaving(
    wallet: WalletContextState,
    saving: Pick<Saving, 'goal' | 'name' | 'startDate' | 'paymentDate'>
): Promise<Saving | null> {
    return null;
}

export async function mock_pay(
    wallet: WalletContextState,
    id: number,
    amount: number
): Promise<Saving | null> {
    return Promise.resolve(mock);
}

export function retrieve(): boolean {
    return true;
}

// should only be accessible to logged in and verified users
export async function blockchain_getSavings(wallet: WalletContextState) {
    if (wallet.publicKey == null) {
        return null;
    }
    const { program, userAccountPublicKey } = getProgram(wallet);
    const germanAccount = await program.account.user.fetch(userAccountPublicKey);
    const userAccount: User = {accounts: germanAccount.anzahl as number};
    // quit if there are no savings accounts to be read
    if (userAccount.accounts == 0) {
        return null;
    }
    console.log("lol");
    const savingsArray: Saving[] = []


    const [savingsAccountPk] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("savings2"), wallet.publicKey.toBuffer(),
            userMint.toBuffer(), new Uint8Array([20])], programId);

    for (let i = 0; i < userAccount.accounts; i++) {
        const [savingsAccountPk] = web3.PublicKey.findProgramAddressSync(
            [Buffer.from("savings1"), wallet.publicKey.toBuffer(),
                userMint.toBuffer(), new Uint8Array([i])], programId);

        console.log('test', savingsAccountPk)

        const gS = await program.account.user.fetch(savingsAccountPk);

        console.log(gS)

        const casted_payments: Payment[] = []
        for (let i = 0; i < (gS.nextPaymentIndex as number); i++) {
            casted_payments.push({
                amount: (gS.amountsOfPayments as number[])[i] as number,
                date: new Date((gS.datesOfPayments as number[])[i] as number),
                id: i as number
            } as Payment);
        }

        const savings: Saving = {
            accessible: gS.accessible as boolean, staking: gS.stalking as boolean,
            accountBalance: gS.accountBalance as number, paymentDate: new Date(gS.auszahlDatum as number),
            startDate: new Date(gS.startDate as number), goal: gS.goal as number, name: gS.name as string,
            id: gS.id as number, payments: casted_payments as Payment[], paid:0
        }
        console.log("Got saving ", i , " of ", userAccount.accounts);
        console.log(savings);
        savingsArray.push(savings);
    }
    return savingsArray;
}

// input: Savings with values of: paymentDate, startDate, goal, name
export async function blockchain_createSaving(wallet: WalletContextState, sav: Pick<Saving, 'goal' | 'name' | 'startDate' | 'paymentDate'>) {
    if (wallet.publicKey == null) {
        return wallet.publicKey;}
    // new savings object as return value
    let saving: Saving = {id: 0, paid:0, payments: [], staking: false, paymentDate: sav.paymentDate,
        accountBalance:0, startDate: sav.startDate, name: sav.name, goal: sav.goal, accessible: false};

    // get necessary keys
    const ownerPublicKey = wallet.publicKey;

    const { program, userAccountPublicKey } = getProgram(wallet);

    let germanAccount = await program.account.user.fetch(userAccountPublicKey);

    const userAccount: User = {accounts: germanAccount.anzahl as number};

    saving.id = userAccount.accounts;

    console.log('test1', userAccount.accounts);
    const [savingsAccountPk] =  web3.PublicKey.findProgramAddressSync(
        [Buffer.from("savings2"), ownerPublicKey.toBuffer(),
            userMint.toBuffer(), new Uint8Array([userAccount.accounts])], programId);
    const [savingTokenPk] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("token_savings1"),ownerPublicKey.toBuffer(),
            userMint.toBuffer(), new Uint8Array([userAccount.accounts])], programId);
    const [authTokenPk] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("auth1"), ownerPublicKey.toBuffer(),
            userMint.toBuffer(), new Uint8Array([userAccount.accounts])], programId);

    // send the init command
    const txHash = await program.methods
        .savingInit(new BN(sav.goal), sav.name, new BN(sav.paymentDate.getDate()),
            new BN(sav.startDate.getDate()))
        .accounts({
            owner: ownerPublicKey,
            saving: savingsAccountPk,
            tokenAccount: savingTokenPk,
            tokenAuth: authTokenPk,
            usersMint: userMint,
            user: userAccountPublicKey,
        })
        .rpc({ skipPreflight: true });

    // Confirm transaction
    await program.provider.connection.confirmTransaction(txHash);

    // get the savings
    console.log( await program.account.user.fetch(savingsAccountPk))
    console.log('test2', userAccount.accounts);

    return saving;
}

export async function blockchain_pay(wallet: WalletContextState, id: number, amount: number): Promise<boolean> {
    if (wallet.publicKey == null) {
        console.log("publicKey -> Null");
        return false;}

    // get necessary keys
    const ownerPublicKey = wallet.publicKey;
    const { program, userAccountPublicKey } = getProgram(wallet);
    const germanAccount = await program.account.user.fetch(userAccountPublicKey);
    const userAccount: User = {accounts: germanAccount.anzahl as number};

    if (id >= userAccount.accounts) {
        console.log("saving account id doesn't exist");
        return false;
    }
    // get necessary keys
    const [savingsAccountPk] =  web3.PublicKey.findProgramAddressSync(
        [Buffer.from("savings1"), ownerPublicKey.toBuffer(),
            userMint.toBuffer(), new Uint8Array([id])], programId);
    const [savingTokenPk] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("token_savings1"),ownerPublicKey.toBuffer(),
            userMint.toBuffer(), new Uint8Array([id])], programId);

    const txHash = await program.methods
        .addToSaving(new BN(amount))
        .accounts({
            owner: userAccountPublicKey,
            saving: savingsAccountPk,
            recipiantAccount: savingTokenPk,
            senderAccount: ownerPublicKey,
            clock: web3.SYSVAR_CLOCK_PUBKEY,
        })
        .rpc();

    return true;
}
