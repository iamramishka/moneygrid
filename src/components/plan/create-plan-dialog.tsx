"use client";

import { useAccounts } from "@/contexts/account-context";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AiRecommendation } from "./ai-recommendation";
import { Loader } from "lucide-react";

interface CreatePlanDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreatePlanDialog({ open, onOpenChange }: CreatePlanDialogProps) {
    const { activeAccountId, addPlan } = useAccounts();
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [goal, setGoal] = useState(10000);
    const [duration, setDuration] = useState(30);
    const [customDuration, setCustomDuration] = useState(45);
    const [intensity, setIntensity] = useState(5);
    const [loading, setLoading] = useState(false);

    const actualDuration = duration === 0 ? customDuration : duration;

    const handleCreatePlan = async () => {
        if (!name.trim() || !activeAccountId || goal <= 0 || actualDuration <= 0) {
            toast({ title: "Invalid Input", description: "Please fill all fields correctly.", variant: "destructive" });
            return;
        }

        setLoading(true);
        
        try {
            await addPlan(activeAccountId, {
                name: name.trim(),
                goal,
                duration: actualDuration,
                intensity,
            });
            toast({ title: "Plan Created!", description: `Your "${name.trim()}" plan is ready.` });
            resetAndClose();
        } catch (error) {
            toast({ title: "Error", description: "Failed to create plan.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };
    
    const resetAndClose = () => {
        setName('');
        setGoal(10000);
        setDuration(30);
        setCustomDuration(45);
        setIntensity(5);
        onOpenChange(false);
    }
    
    return (
        <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) resetAndClose(); else onOpenChange(true); }}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">Create a New Savings Plan</DialogTitle>
                    <DialogDescription>Let's set up your next savings goal.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Plan Name</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., New Laptop Fund" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="goal">Goal Amount (LKR)</Label>
                        <Input id="goal" type="number" value={goal} onChange={e => setGoal(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label>Plan Duration</Label>
                        <Tabs value={String(duration)} onValueChange={(val) => setDuration(Number(val))}>
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="30">30 Days</TabsTrigger>
                                <TabsTrigger value="365">365 Days</TabsTrigger>
                                <TabsTrigger value="0">Custom</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        {duration === 0 && (
                            <Input className="mt-2" type="number" value={customDuration} onChange={e => setCustomDuration(Number(e.target.value))} placeholder="Enter number of days" />
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="intensity">Savings Intensity ({intensity})</Label>
                        <p className="text-sm text-muted-foreground">How challenging do you want the savings to be? (1=low, 10=high)</p>
                        <Slider id="intensity" min={1} max={10} step={1} value={[intensity]} onValueChange={val => setIntensity(val[0])} />
                    </div>

                    <AiRecommendation goalAmount={goal} durationDays={actualDuration} savingsIntensity={intensity} />
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetAndClose}>Cancel</Button>
                    <Button type="button" onClick={handleCreatePlan} disabled={!name.trim() || goal <= 0 || actualDuration <= 0 || loading}>
                        {loading ? <Loader className="animate-spin" /> : "Create Plan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
