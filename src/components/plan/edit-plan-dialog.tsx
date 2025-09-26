"use client";

import { useAccounts } from "@/contexts/account-context";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Plan } from "@/lib/types";
import { Loader } from "lucide-react";

interface EditPlanDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    plan: Plan;
}

export function EditPlanDialog({ open, onOpenChange, plan }: EditPlanDialogProps) {
    const { activeAccountId, updatePlan } = useAccounts();
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [goal, setGoal] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (plan) {
            setName(plan.name);
            setGoal(plan.goal);
        }
    }, [plan]);

    const handleUpdatePlan = async () => {
        if (!name.trim() || !activeAccountId || goal <= 0) {
            toast({ title: "Invalid Input", description: "Please fill all fields correctly.", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            if(activeAccountId){
                 await updatePlan(activeAccountId, plan.id, {
                    name: name.trim(),
                    goal,
                });
                toast({ title: "Plan Updated!", description: `Your "${name.trim()}" plan has been updated.` });
                onOpenChange(false);
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to update plan.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">Edit Savings Plan</DialogTitle>
                    <DialogDescription>Update the details of your savings plan.</DialogDescription>
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
                        <Label htmlFor="duration">Plan Duration (Days)</Label>
                        <Input id="duration" type="number" value={plan.duration} disabled />
                        <p className="text-xs text-muted-foreground">Duration and intensity cannot be changed after a plan is created.</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="button" onClick={handleUpdatePlan} disabled={!name.trim() || goal <= 0 || loading}>
                        {loading ? <Loader className="animate-spin" /> : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
