import { Icons } from '@/components/icons';
import { redirect } from 'next/navigation';

export default async function NotFoundPage() {
    redirect('/');

    return null;
}
