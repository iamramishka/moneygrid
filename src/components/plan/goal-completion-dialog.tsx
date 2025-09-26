"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GoalCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName: string;
  goalAmount: number;
  currency: string;
}

export function GoalCompletionDialog({
  open,
  onOpenChange,
  planName,
  goalAmount,
  currency,
}: GoalCompletionDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (open && canvasRef.current && isClient) {
      const myConfetti = confetti.create(canvasRef.current, {
        resize: true,
        useWorker: true,
      });
      myConfetti({
        particleCount: 150,
        spread: 180,
        origin: { y: 0.6 }
      });
    }
  }, [open, isClient]);

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(goalAmount);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
        <DialogHeader className="z-10">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
            <PartyPopper className="h-12 w-12 text-primary" />
          </div>
          <DialogTitle className="text-center font-headline text-3xl text-primary">Congratulations!</DialogTitle>
          <DialogDescription className="text-center text-lg">
            You've successfully reached your goal for the "{planName}" plan.
          </DialogDescription>
        </DialogHeader>
        <div className="text-center my-4 z-10">
          <p className="text-4xl font-bold">{formattedAmount}</p>
          <p className="text-muted-foreground">Saved!</p>
        </div>
        <DialogFooter className="z-10">
          <Button className="w-full" onClick={() => onOpenChange(false)}>
            Awesome!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
