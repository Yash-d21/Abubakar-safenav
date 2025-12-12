// Detects distress sounds and confirms them with device sensors to trigger alerts.

'use server';

/**
 * @fileOverview Implements on-device audio analysis to detect distress sounds and confirm them with device sensors, triggering an emergency alert if the user is in danger and unable to manually activate it.
 *
 * - detectDistress - A function that initiates distress detection.
 * - DetectDistressInput - The input type for the detectDistress function.
 * - DetectDistressOutput - The return type for the detectDistress function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectDistressInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A 30-second audio recording as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  accelerometerData: z.array(z.number()).describe('Accelerometer data readings (x, y, z).'),
  gyroscopeData: z.array(z.number()).describe('Gyroscope data readings (x, y, z).'),
});
export type DetectDistressInput = z.infer<typeof DetectDistressInputSchema>;

const DetectDistressOutputSchema = z.object({
  isDistressConfirmed: z
    .boolean()
    .describe(
      'Whether the detected audio distress pattern is confirmed by accelerometer and gyroscope data.'
    ),
  distressReason: z.string().optional().describe('The potential reason for the distress, if any.'),
});
export type DetectDistressOutput = z.infer<typeof DetectDistressOutputSchema>;

export async function detectDistress(input: DetectDistressInput): Promise<DetectDistressOutput> {
  return detectDistressFlow(input);
}

const analyzeDistressPrompt = ai.definePrompt({
  name: 'analyzeDistressPrompt',
  input: {schema: DetectDistressInputSchema},
  output: {schema: DetectDistressOutputSchema},
  prompt: `You are an AI assistant designed to analyze audio and sensor data to determine if a user is in distress.\n\n  Analyze the provided audio data, accelerometer data, and gyroscope data to assess the likelihood of a distress event. A distress event can include a user screaming, glass breaking, or sudden impacts. Correlate the audio analysis with sudden movements or falls detected by the accelerometer and gyroscope to reduce false positives.  If the on-device sensor data confirms the distress event, set the isDistressConfirmed field to true, otherwise set it to false.  Provide a brief reason if the audio and sensor confirms a likely distress event.\n\n  Audio data: {{media url=audioDataUri}}\n  Accelerometer data: {{{accelerometerData}}}\n  Gyroscope data: {{{gyroscopeData}}} `,
});

const detectDistressFlow = ai.defineFlow(
  {
    name: 'detectDistressFlow',
    inputSchema: DetectDistressInputSchema,
    outputSchema: DetectDistressOutputSchema,
  },
  async input => {
    const {output} = await analyzeDistressPrompt(input);
    return output!;
  }
);
