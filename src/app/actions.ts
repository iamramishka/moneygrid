'use server';

import { getSavingsRecommendation, type SavingsRecommendationInput, type SavingsRecommendationOutput } from '@/ai/flows/savings-intensity-recommendation';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

export async function getAIRecommendationAction(input: SavingsRecommendationInput): Promise<{ success: true; data: SavingsRecommendationOutput } | { success: false; error: string }> {
    try {
        if (!input.goalAmount || !input.durationDays || !input.savingsIntensity) {
            return { success: false, error: 'Invalid input provided for recommendation.' };
        }
        const result = await getSavingsRecommendation(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('AI Recommendation Error:', error);
        return { success: false, error: 'Failed to get AI recommendation from the server.' };
    }
}
