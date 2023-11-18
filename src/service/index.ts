export type User = {
    accounts: number;
};

export type Saving = {
    accessible: boolean;
    staking: boolean;
    accountBalance: number;
    paymentDate: string;
    goal: number;
    name: string;
    id: number;
    datesOfPayments: number[100];
    amountsOfPayments: number[100];
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
