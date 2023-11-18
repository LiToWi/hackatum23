'use client';

import * as React from 'react';

import { cn } from '@/lib/shadcn-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Icons } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { connect } from '@/service';
import { set } from '@/lib/store';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AuthForm({ className, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>('Asfd');
    const router = useRouter();

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        const id = event.currentTarget.elements.id.value;
        const password = event.currentTarget.elements.password.value;
        const isPersistent =
            event.currentTarget.elements.save.dataset.state === 'checked';

        connect(id, password)
            .then(() => {
                set(id, password, isPersistent);
                // router.replace('/');
            })
            .catch(() => {
                setError('Invalid credentials');
                setIsLoading(false);
            });
    }

    return (
        <div className={cn('grid gap-6', className)} {...props}>
            <form onSubmit={onSubmit}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="id">
                            Wallet-Id
                        </Label>
                        <Input
                            id="id"
                            placeholder="ET63Eb..."
                            autoCapitalize="none"
                            autoCorrect="off"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="password">
                            Passwort
                        </Label>
                        <Input
                            id="password"
                            placeholder="Passwort"
                            type="password"
                            autoCapitalize="none"
                            autoCorrect="off"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="save" />
                        <label
                            htmlFor="save"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Save credentials
                        </label>
                    </div>
                    {error && <p className="text-red-600">{error}</p>}
                    <Button disabled={isLoading}>
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Login
                    </Button>
                </div>
            </form>
        </div>
    );
}
