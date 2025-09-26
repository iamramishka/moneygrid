"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getAIRecommendationAction } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Loader, ServerCrash } from 'lucide-react';
import type { SavingsRecommendationOutput } from '@/ai/flows/savings-intensity-recommendation';

interface AiRecommendationProps {
    goalAmount: number;
    durationDays: number;
    savingsIntensity: number;
}

export function AiRecommendation({ goalAmount, durationDays, savingsIntensity }: AiRecommendationProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [recommendation, setRecommendation] = useState<SavingsRecommendationOutput | null>(null);
    
    const getRecommendation = async () => {
        setLoading(true);
        setError(null);
        setRecommendation(null);
        const result = await getAIRecommendationAction({ goalAmount, durationDays, savingsIntensity });
        if (result.success) {
            setRecommendation(result.data);
        } else {
            setError(result.error || 'An unknown error occurred.');
        }
        setLoading(false);
    }
    
    return (
        <div className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-semibold">Need a suggestion?</h4>
                    <p className="text-sm text-muted-foreground">Get an AI-powered daily savings recommendation.</p>
                </div>
                <Button onClick={getRecommendation} disabled={loading} size="sm">
                    {loading ? <Loader className="animate-spin mr-2 h-4 w-4" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                    Get Suggestion
                </Button>
            </div>
            {error && (
                 <Alert variant="destructive">
                    <ServerCrash className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {recommendation && (
                 <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle>AI Recommendation</AlertTitle>
                    <AlertDescription>
                       <p className="font-bold text-lg">Save ~LKR {recommendation.dailySavingsRecommendation.toLocaleString()} daily.</p>
                       <p className="text-xs">{recommendation.explanation}</p>
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
