"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
    title: string;
    value: number;
    currency?: string;
    isPercentage?: boolean;
    suffix?: string;
}

export function StatsCard({ title, value, currency = 'LKR', isPercentage = false, suffix = '' }: StatsCardProps) {
    const formattedValue = isPercentage
        ? `${value.toFixed(1)}%`
        : suffix 
        ? `${value.toLocaleString()}${suffix}`
        : new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(value);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formattedValue}</div>
            </CardContent>
        </Card>
    );
}
