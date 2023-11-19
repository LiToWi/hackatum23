import { cn } from '@/lib/shadcn-utils';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogHeader,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Popover } from '../ui/popover';
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { addDays, format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { DateRange } from 'react-day-picker';

export function NewSaving(props: {
    open: boolean;
    onSubmit: (values: { name: string; goal: number; date: DateRange }) => void;
    onClose: () => void;
}) {
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 90),
    });
    const name = useRef<HTMLInputElement>(null);
    const goal = useRef<HTMLInputElement>(null);

    const onSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (
            !date ||
            !date.from ||
            !date.to ||
            !name.current?.value ||
            !goal.current?.value
        )
            return;

        props.onSubmit({
            date,
            name: name.current.value,
            goal: goal.current.valueAsNumber,
        });
    };

    return (
        <Dialog open={props.open} onOpenChange={() => props.onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New Saving</DialogTitle>
                    <DialogDescription>Add a new saving.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            placeholder="vacation"
                            className="col-span-3"
                            ref={name}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="goal" className="text-right">
                            Goal
                        </Label>
                        <Input
                            id="goal"
                            placeholder="500"
                            className="col-span-3"
                            type="number"
                            ref={goal}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="saving-period" className="text-right">
                            Saving Period
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="saving-period"
                                    variant={'outline'}
                                    className={cn(
                                        'col-span-3 justify-start text-left font-normal',
                                        !date && 'text-muted-foreground'
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date?.from ? (
                                        date.to ? (
                                            <>
                                                {format(date.from, 'LLL dd y')}{' '}
                                                - {format(date.to, 'LLL dd y')}
                                            </>
                                        ) : (
                                            format(date.from, 'LLL dd y')
                                        )
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0 bg-white"
                                align="start"
                            >
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={date?.from}
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={onSubmit}>
                        Adopt pig
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
