
'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';

interface TimePickerProps {
    value?: string;
    onChange: (value: string) => void;
}

export default function TimePicker({ value, onChange }: TimePickerProps) {
    const [hour, setHour] = useState('');
    const [minute, setMinute] = useState('');
    const [period, setPeriod] = useState('');

    useEffect(() => {
        if (value) {
            const parts = value.split(/[: ]/);
            if (parts.length === 3) {
                setHour(parts[0]);
                setMinute(parts[1]);
                setPeriod(parts[2].toUpperCase());
            }
        } else {
            setHour('');
            setMinute('');
            setPeriod('');
        }
    }, [value]);

    const triggerOnChange = (h: string, m: string, p: string) => {
        if (h && m && p) {
            onChange(`${h}:${m} ${p}`);
        }
    }

    const handleHourChange = (newHour: string) => {
        setHour(newHour);
        triggerOnChange(newHour, minute, period);
    };

    const handleMinuteChange = (newMinute: string) => {
        setMinute(newMinute);
        triggerOnChange(hour, newMinute, period);
    };
    
    const handlePeriodChange = (newPeriod: string) => {
        setPeriod(newPeriod);
        triggerOnChange(hour, minute, newPeriod);
    };

    return (
        <div className="grid grid-cols-3 gap-2">
            <Select value={hour} onValueChange={handleHourChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(h => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={minute} onValueChange={handleMinuteChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent>
                    {['00', '15', '30', '45'].map(m => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={period} onValueChange={handlePeriodChange}>
                <SelectTrigger>
                    <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
