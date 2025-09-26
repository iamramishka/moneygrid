"use client";
import { useAccounts } from "@/contexts/account-context";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { CreatePlanDialog } from "../plan/create-plan-dialog";
import { PlanSummaryCard } from "./plan-summary-card";
import { AnalyticsSection } from "./analytics-section";
import { StatsCard } from "./stats-card";

type DashboardViewProps = {
    onSelectPlan: (planId: string) => void;
};

export function DashboardView({ onSelectPlan }: DashboardViewProps) {
    const { activeAccount } = useAccounts();
    const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);

    if (!activeAccount) {
        return <div className="text-center">Please select an account.</div>;
    }
    
    const allPlans = activeAccount.plans;
    const totalGoal = allPlans.reduce((sum, p) => sum + p.goal, 0);
    const totalSaved = allPlans.reduce((sum, p) => {
        const tilesSaved = p.tiles.filter(t => t.saved).reduce((s, t) => s + t.amount, 0);
        const extraSaved = p.extraSavings.reduce((s, e) => s + e.amount, 0);
        return sum + tilesSaved + extraSaved;
    }, 0);
    const totalRemaining = totalGoal > totalSaved ? totalGoal - totalSaved : 0;
    const overallProgress = totalGoal > 0 ? (totalSaved / totalGoal) * 100 : 0;

    return (
        <div className="space-y-8">
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-headline font-bold">Dashboard: {activeAccount.name}</h2>
                    <Button onClick={() => setIsCreatePlanOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Create New Plan
                    </Button>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard title="Total Saved" value={totalSaved} currency={allPlans.length > 0 ? allPlans[0].currency : 'LKR'} />
                    <StatsCard title="Total Goal" value={totalGoal} currency={allPlans.length > 0 ? allPlans[0].currency : 'LKR'} />
                    <StatsCard title="Total Remaining" value={totalRemaining} currency={allPlans.length > 0 ? allPlans[0].currency : 'LKR'} />
                    <StatsCard title="Overall Progress" value={overallProgress} isPercentage={true} />
                </div>
            </div>

            <div>
                <h3 className="text-2xl font-headline font-bold mb-4">Your Plans</h3>
                {allPlans.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {allPlans.map(plan => (
                            <PlanSummaryCard key={plan.id} plan={plan} onSelectPlan={onSelectPlan} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground mb-4">You have no savings plans yet.</p>
                        <Button onClick={() => setIsCreatePlanOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Plan
                        </Button>
                    </div>
                )}
            </div>
            
            {allPlans.length > 0 && <AnalyticsSection plans={allPlans} />}

            <CreatePlanDialog open={isCreatePlanOpen} onOpenChange={setIsCreatePlanOpen} />
        </div>
    );
}
