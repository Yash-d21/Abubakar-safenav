'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate a real-time safety score for street segments using the Gemini API.
 *
 * - generateSafetyScore - An async function that takes aggregated crime data and returns a safety score.
 * - GenerateSafetyScoreInput - The input type for the generateSafetyScore function.
 * - GenerateSafetyScoreOutput - The return type for the generateSafetyScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSafetyScoreInputSchema = z.object({
  locationDescription: z
    .string()
    .describe('Description of the location including street and neighborhood.'),
  crimeData: z
    .string()
    .describe(
      'Aggregated crime data for the location, including type and frequency of incidents.'
    ),
  newsData: z
    .string()
    .describe(
      'Recent news articles and social media feeds related to safety concerns in the area.'
    ),
  userReports: z
    .string()
    .describe(
      'User-submitted reports of unsafe conditions, such as poor lighting or harassment.'
    ),
});
export type GenerateSafetyScoreInput = z.infer<typeof GenerateSafetyScoreInputSchema>;

const GenerateSafetyScoreOutputSchema = z.object({
  safetyScore: z
    .number()
    .describe(
      'A real-time safety score (1-10, where 1 is highly unsafe) for the location.'
    ),
  reason: z
    .string()
    .describe('The reasons for the safety score, based on the provided data.'),
});
export type GenerateSafetyScoreOutput = z.infer<typeof GenerateSafetyScoreOutputSchema>;

export async function generateSafetyScore(
  input: GenerateSafetyScoreInput
): Promise<GenerateSafetyScoreOutput> {
  return generateSafetyScoreFlow(input);
}

const safetyScorePrompt = ai.definePrompt({
  name: 'safetyScorePrompt',
  input: {schema: GenerateSafetyScoreInputSchema},
  output: {schema: GenerateSafetyScoreOutputSchema},
  prompt: `You are an AI assistant that analyzes crime data, news reports, and user reports to generate a real-time safety score for a specific location.

  Location Description: {{{locationDescription}}}
  Crime Data: {{{crimeData}}}
  News Data: {{{newsData}}}
  User Reports: {{{userReports}}}

  Based on the provided information, generate a safety score between 1 and 10 (where 1 is highly unsafe and 10 is very safe) for this location.  Also, provide a detailed explanation for the generated safety score.

  Your output MUST be in JSON format and satisfy the following schema:
  ${JSON.stringify(GenerateSafetyScoreOutputSchema.describe(''))}`,
});

const generateSafetyScoreFlow = ai.defineFlow(
  {
    name: 'generateSafetyScoreFlow',
    inputSchema: GenerateSafetyScoreInputSchema,
    outputSchema: GenerateSafetyScoreOutputSchema,
  },
  async input => {
    const {output} = await safetyScorePrompt(input);
    return output!;
  }
);
