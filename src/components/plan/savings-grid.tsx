"use client";
import { Tile } from "@/lib/types";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { useState } from "react";

interface SavingsGridProps {
    tiles: Tile[];
    onToggleSaved: (tileId: string, saved: boolean) => void;
}

export function SavingsGrid({ tiles, onToggleSaved }: SavingsGridProps) {
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Savings Grid</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2">
                    {tiles.map(tile => {
                        const isSaved = tile.saved;
                        
                        const tileContent = (
                            <button
                                disabled={isSaved}
                                className={cn(
                                    "aspect-square rounded-lg flex flex-col items-center justify-center text-center p-1 transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                    isSaved 
                                        ? "bg-primary text-primary-foreground shadow-inner cursor-not-allowed"
                                        : "bg-secondary hover:bg-secondary/80 hover:scale-105 hover:shadow-lg",
                                    "active:scale-95"
                                )}
                                aria-label={isSaved ? `Amount ${tile.amount} saved` : `Save ${tile.amount}`}
                            >
                                {isSaved ? (
                                    <Check className="h-6 w-6" />
                                ) : null}
                                <span className="text-lg font-bold">{tile.amount}</span>
                            </button>
                        );

                        if (isSaved) {
                            return <div key={tile.id}>{tileContent}</div>
                        }

                        return (
                            <AlertDialog key={tile.id}>
                                <AlertDialogTrigger asChild>
                                    {tileContent}
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Confirm Savings</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to mark LKR {tile.amount} as saved?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => onToggleSaved(tile.id, true)}>
                                            Confirm
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
