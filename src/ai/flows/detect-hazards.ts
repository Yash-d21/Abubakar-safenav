'use server';

/**
 * @fileOverview This file defines a Genkit flow to detect environmental hazards along a route.
 *
 * - detectHazards - An async function that takes a route description and returns potential hazards.
 * - DetectHazardsInput - The input type for the detectHazards function.
 * - DetectHazardsOutput - The return type for the detectHazards function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectHazardsInputSchema = z.object({
  routeDescription: z.string().describe('A description of the route, including start, end, and general path.'),
});
export type DetectHazardsInput = z.infer<typeof DetectHazardsInputSchema>;

const DetectHazardsOutputSchema = z.object({
  hasHazards: z.boolean().describe('Whether any significant environmental or public event hazards were detected.'),
  hazardSummary: z.string().optional().describe('A brief summary of the detected hazards.'),
});
export type DetectHazardsOutput = z.infer<typeof DetectHazardsOutputSchema>;

export async function detectHazards(input: DetectHazardsInput): Promise<DetectHazardsOutput> {
  return detectHazardsFlow(input);
}

const hazardPrompt = ai.definePrompt({
  name: 'hazardPrompt',
  input: {schema: DetectHazardsInputSchema},
  output: {schema: DetectHazardsOutputSchema},
  prompt: `You are a safety AI that analyzes a travel route for potential environmental or event-based hazards. 
  
  Analyze the following route: {{{routeDescription}}}

  Simulate a check against real-time data for the following types of hazards:
  - Extreme weather events (e.g., flash flood warnings, severe thunderstorms, blizzards)
  - Public events (e.g., parades, protests, marathons that may cause road closures or large crowds)
  - Major accidents or road closures.

  For this simulation, if the route is through a major urban area like New York, invent a plausible hazard (e.g., a protest, street festival, or water main break). If no hazard is plausible, report that the route is clear.

  Set 'hasHazards' to true if you find a plausible hazard, and provide a one-sentence summary in 'hazardSummary'. Otherwise, set 'hasHazards' to false.`,
});

const detectHazardsFlow = ai.defineFlow(
  {
    name: 'detectHazardsFlow',
    inputSchema: DetectHazardsInputSchema,
    outputSchema: DetectHazardsOutputSchema,
  },
  async input => {
    const {output} = await hazardPrompt(input);
    return output!;
  }
);
