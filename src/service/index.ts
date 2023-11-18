export type User = {
    accounts: number;
};

export type Payment = {
    amount: number;
    date: string;
    id: number;
};

export type Saving = {
    accessible: boolean;
    staking: boolean;
    accountBalance: number;
    paymentDate: string;
    goal: number;
    name: string;
    id: number;
    payments: Payment[];
};

export function getUser(): User | null {
    return null;
}

export function createUser(): User | null {
    return null;
}

export function getSavings(): Saving[] | null {
    return null;
}

export function createSaving(): Saving | null {
    return null;
}

export function pay(): boolean {
    return true;
}

export function retrieve(): boolean {
    return true;
}
