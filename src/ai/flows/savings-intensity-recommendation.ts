/**
 * @fileOverview Provides AI-powered recommendations for daily savings amounts based on user-selected savings intensity.
 *
 * - `getSavingsRecommendation` - A function that generates savings recommendations.
 * - `SavingsRecommendationInput` - The input type for the `getSavingsRecommendation` function.
 * - `SavingsRecommendationOutput` - The return type for the `getSavingsRecommendation` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SavingsRecommendationInputSchema = z.object({
  goalAmount: z.number().describe('The total amount the user wants to save.'),
  durationDays: z.number().describe('The duration of the savings plan in days.'),
  savingsIntensity: z
    .number()
    .min(1)
    .max(10)
    .describe(
      'A rating from 1 to 10 indicating the user\'s desired savings intensity, where 1 is very low and 10 is very high.'
    ),
});
export type SavingsRecommendationInput = z.infer<typeof SavingsRecommendationInputSchema>;

const SavingsRecommendationOutputSchema = z.object({
  dailySavingsRecommendation: z
    .number()
    .describe('The recommended daily savings amount.'),
  explanation: z.string().describe('Explanation of how the recommendation was calculated')
});
export type SavingsRecommendationOutput = z.infer<typeof SavingsRecommendationOutputSchema>;

export async function getSavingsRecommendation(input: SavingsRecommendationInput): Promise<SavingsRecommendationOutput> {
  return savingsRecommendationFlow(input);
}

const savingsRecommendationPrompt = ai.definePrompt({
  name: 'savingsRecommendationPrompt',
  input: {schema: SavingsRecommendationInputSchema},
  output: {schema: SavingsRecommendationOutputSchema},
  prompt: `You are a personal finance advisor. A user wants to save LKR {{goalAmount}} in {{durationDays}} days. The user has selected a savings intensity of {{savingsIntensity}} (1-10, 1 is low, 10 is high).

  Calculate a recommended daily savings amount and explain how you arrived at that number. Take into account the savings intensity, so that higher values represent higher daily savings amounts, and lower values represent lower daily savings amounts. The savings intensity is an indication of risk tolerance.
  Be concise in your answer.

  Ensure that the dailySavingsRecommendation field is a number, not a string.
  `,
});

const savingsRecommendationFlow = ai.defineFlow(
  {
    name: 'savingsRecommendationFlow',
    inputSchema: SavingsRecommendationInputSchema,
    outputSchema: SavingsRecommendationOutputSchema,
  },
  async input => {
    const {output} = await savingsRecommendationPrompt(input);
    return output!;
  }
);
