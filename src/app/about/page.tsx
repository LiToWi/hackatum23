import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About',
};

export default function Page() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1 className="text-6xl">About</h1>
            <p className="text-2xl">
                This is a project developed at hackaTUM 2023.
            </p>
        </main>
    );
}
