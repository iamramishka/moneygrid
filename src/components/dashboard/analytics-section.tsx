"use client";

import { Plan } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useMemo } from "react";
import { format, parseISO, startOfMonth } from 'date-fns';

interface AnalyticsSectionProps {
    plans: Plan[];
}

const chartConfig = {
    saved: {
      label: "Saved",
      color: "hsl(var(--primary))",
    },
    cumulative: {
      label: "Cumulative",
      color: "hsl(var(--accent))",
    },
  } satisfies ChartConfig;

export function AnalyticsSection({ plans }: AnalyticsSectionProps) {

    const { monthlyData, cumulativeData } = useMemo(() => {
        const allSavings: { date: Date; amount: number }[] = [];
        plans.forEach(plan => {
            plan.tiles.forEach(tile => {
                if(tile.saved && tile.savedDate) {
                    allSavings.push({ date: parseISO(tile.savedDate), amount: tile.amount });
                }
            });
            plan.extraSavings.forEach(saving => {
                allSavings.push({ date: parseISO(saving.date), amount: saving.amount });
            });
        });

        allSavings.sort((a,b) => a.date.getTime() - b.date.getTime());

        // Process monthly data
        const monthlyAgg: { [key: string]: number } = {};
        allSavings.forEach(saving => {
            const monthKey = format(startOfMonth(saving.date), 'MMM yyyy');
            if(!monthlyAgg[monthKey]) monthlyAgg[monthKey] = 0;
            monthlyAgg[monthKey] += saving.amount;
        });

        const monthlyChartData = Object.keys(monthlyAgg).map(key => ({
            month: key,
            saved: monthlyAgg[key]
        })).slice(-12); // Show last 12 months

        // Process cumulative data
        let cumulativeTotal = 0;
        const cumulativeChartData = allSavings.map(saving => {
            cumulativeTotal += saving.amount;
            return { date: format(saving.date, 'yyyy-MM-dd'), cumulative: cumulativeTotal };
        });

        return { monthlyData: monthlyChartData, cumulativeData: cumulativeChartData };

    }, [plans]);

    return (
        <div>
            <h3 className="text-2xl font-headline font-bold mb-4">Analytics</h3>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Cumulative Savings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-64">
                            <AreaChart data={cumulativeData}>
                                <defs>
                                    <linearGradient id="fillCumulative" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => format(parseISO(value), "MMM d")} />
                                <YAxis width={80} tickFormatter={(value) => `LKR ${Number(value) / 1000}k`} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                                <Area dataKey="cumulative" type="natural" fill="url(#fillCumulative)" stroke="hsl(var(--accent))" stackId="a" />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Savings</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <ChartContainer config={chartConfig} className="h-64">
                            <BarChart data={monthlyData}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis width={80} tickFormatter={(value) => `LKR ${Number(value) / 1000}k`} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="saved" fill="hsl(var(--primary))" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
