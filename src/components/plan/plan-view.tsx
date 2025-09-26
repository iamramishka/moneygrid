"use client";

import { useAccounts } from "@/contexts/account-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Loader } from "lucide-react";
import { StatsCard } from "../dashboard/stats-card";
import { SavingsGrid } from "./savings-grid";
import { Progress } from "../ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";
import { GoalCompletionDialog } from "./goal-completion-dialog";

interface PlanViewProps {
    planId: string;
    onBack: () => void;
}

export function PlanView({ planId, onBack }: PlanViewProps) {
    const { activeAccount, updateTile, addExtraSaving } = useAccounts();
    const { toast } = useToast();
    const [extraAmount, setExtraAmount] = useState<number | ''>('');
    const [extraDescription, setExtraDescription] = useState('');
    const [isGoalComplete, setIsGoalComplete] = useState(false);
    const [wasGoalComplete, setWasGoalComplete] = useState(false);
    const [loadingExtra, setLoadingExtra] = useState(false);

    const plan = activeAccount?.plans.find(p => p.id === planId);

    const savedFromTiles = plan?.tiles.filter(t => t.saved).reduce((sum, tile) => sum + tile.amount, 0) || 0;
    const savedFromExtra = plan?.extraSavings.reduce((sum, saving) => sum + saving.amount, 0) || 0;
    const totalSaved = savedFromTiles + savedFromExtra;

    useEffect(() => {
        if (plan) {
            const isComplete = totalSaved >= plan.goal;
            if (isComplete && !wasGoalComplete) {
                setIsGoalComplete(true);
                setWasGoalComplete(true);
            } else if (!isComplete) {
                setWasGoalComplete(false);
            }
        }
    }, [totalSaved, plan, wasGoalComplete]);

    if (!plan || !activeAccount) {
        return (
            <div>
                <Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Button>
                <div className="text-center py-10">Plan not found.</div>
            </div>
        );
    }
    
    const remaining = plan.goal > totalSaved ? plan.goal - totalSaved : 0;
    const progress = plan.goal > 0 ? (totalSaved / plan.goal) * 100 : 0;
    const tilesSaved = plan.tiles.filter(t => t.saved).length;

    const handleMarkAsSaved = (tileId: string, saved: boolean) => {
        if (!activeAccount) return;
        updateTile(activeAccount.id, plan.id, tileId, { saved, savedDate: saved ? new Date().toISOString() : null });
    };
    
    const handleAddExtraSaving = async () => {
        if (typeof extraAmount !== 'number' || extraAmount <= 0) {
            toast({ title: 'Invalid Amount', description: 'Please enter a valid amount.', variant: 'destructive'});
            return;
        }
        if (!activeAccount) return;
        setLoadingExtra(true);
        try {
            await addExtraSaving(activeAccount.id, plan.id, {
                amount: extraAmount,
                description: extraDescription,
                date: new Date().toISOString()
            });
            toast({ title: 'Extra Saving Added', description: `LKR ${extraAmount} added to your plan.`});
            setExtraAmount('');
            setExtraDescription('');
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to add extra saving.', variant: 'destructive'});
        } finally {
            setLoadingExtra(false);
        }
    };

    return (
        <div className="space-y-8">
             <GoalCompletionDialog open={isGoalComplete} onOpenChange={setIsGoalComplete} planName={plan.name} goalAmount={plan.goal} currency={plan.currency} />
            <div>
                <Button variant="ghost" onClick={onBack} className="mb-4"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Button>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-headline font-bold">{plan.name}</h2>
                        <p className="text-muted-foreground">{plan.duration}-day plan</p>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                 <div className="flex justify-between text-sm font-medium">
                    <span>Progress</span>
                    <span className="text-muted-foreground">{progress.toFixed(1)}%</span>
                </div>
                <Progress value={progress} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Total Saved" value={totalSaved} currency={plan.currency} />
                <StatsCard title="Goal" value={plan.goal} currency={plan.currency} />
                <StatsCard title="Remaining" value={remaining} currency={plan.currency} />
                <StatsCard title="Tiles Saved" value={tilesSaved} suffix={` / ${plan.tiles.length}`} />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <SavingsGrid 
                        tiles={plan.tiles} 
                        onToggleSaved={handleMarkAsSaved}
                    />
                </div>
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add Extra Savings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input 
                                type="number" 
                                placeholder="Amount (LKR)" 
                                value={extraAmount} 
                                onChange={e => setExtraAmount(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                             <Textarea 
                                placeholder="Description (optional, e.g., Birthday gift)" 
                                value={extraDescription} 
                                onChange={e => setExtraDescription(e.target.value)}
                            />
                            <Button onClick={handleAddExtraSaving} className="w-full" disabled={loadingExtra}>
                                {loadingExtra ? <Loader className="animate-spin" /> : <><Plus className="mr-2 h-4 w-4" /> Add Saving</>}
                            </Button>
                        </CardContent>
                    </Card>
                     {plan.extraSavings.length > 0 && (
                        <Card>
                        <CardHeader><CardTitle>Extra Savings Log</CardTitle></CardHeader>
                        <CardContent className="max-h-60 overflow-y-auto">
                            <ul className="space-y-2">
                                {plan.extraSavings.slice().reverse().map(saving => (
                                    <li key={saving.id} className="text-sm flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold">LKR {saving.amount.toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(saving.date).toLocaleDateString()}</p>
                                        </div>
                                        <p className="text-xs text-muted-foreground italic truncate max-w-[100px]">{saving.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                     )}
                </div>
            </div>

        </div>
    );
}
