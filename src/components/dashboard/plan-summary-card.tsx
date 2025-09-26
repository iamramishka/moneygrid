"use client";
import type { Plan } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { EditPlanDialog } from "../plan/edit-plan-dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { useAccounts } from "@/contexts/account-context";
import { useToast } from "@/hooks/use-toast";

interface PlanSummaryCardProps {
    plan: Plan;
    onSelectPlan: (planId: string) => void;
}

export function PlanSummaryCard({ plan, onSelectPlan }: PlanSummaryCardProps) {
    const { activeAccountId, deletePlan } = useAccounts();
    const { toast } = useToast();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const savedFromTiles = plan.tiles
        .filter(t => t.saved)
        .reduce((sum, tile) => sum + tile.amount, 0);

    const savedFromExtra = plan.extraSavings.reduce((sum, saving) => sum + saving.amount, 0);
    
    const totalSaved = savedFromTiles + savedFromExtra;
    const progress = plan.goal > 0 ? (totalSaved / plan.goal) * 100 : 0;

    const handleDelete = () => {
        if(activeAccountId) {
            deletePlan(activeAccountId, plan.id);
            toast({ title: "Plan Deleted", description: `"${plan.name}" has been deleted.`, variant: "destructive"});
            setIsDeleteDialogOpen(false);
        }
    }

    return (
        <>
            <Card 
                className="hover:border-primary transition-colors flex flex-col"
            >
                <div onClick={() => onSelectPlan(plan.id)} className="cursor-pointer flex-grow">
                    <CardHeader>
                        <CardTitle className="truncate">{plan.name}</CardTitle>
                        <CardDescription>
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: plan.currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(plan.goal)} Goal
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Progress value={progress} />
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: plan.currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalSaved)} saved</span>
                                <span>{progress.toFixed(1)}%</span>
                            </div>
                        </div>
                    </CardContent>
                </div>
                <CardFooter className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">{plan.duration} Day Plan</p>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardFooter>
            </Card>
            <EditPlanDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} plan={plan} />
            
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the "{plan.name}" plan and all its data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
