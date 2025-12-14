'use server';

/**
 * @fileOverview Implements an AI Guardian to analyze and summarize a chat conversation during an active SOS event.
 *
 * - summarizeChat - A function that takes a chat history and returns a summary.
 * - SummarizeChatInput - The input type for the summarizeChat function.
 * - SummarizeChatOutput - The return type for the summarizeChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeChatInputSchema = z.object({
  chatHistory: z.string().describe('The full transcript of the chat conversation.'),
});
export type SummarizeChatInput = z.infer<typeof SummarizeChatInputSchema>;

const SummarizeChatOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the key events and status from the chat.'),
});
export type SummarizeChatOutput = z.infer<typeof SummarizeChatOutputSchema>;

export async function summarizeChat(input: SummarizeChatInput): Promise<SummarizeChatOutput> {
  return summarizeChatFlow(input);
}

const summarizeChatPrompt = ai.definePrompt({
  name: 'summarizeChatPrompt',
  input: {schema: SummarizeChatInputSchema},
  output: {schema: SummarizeChatOutputSchema},
  prompt: `You are an AI Guardian monitoring an emergency situation. Your role is to provide a brief, factual summary of the chat log for responders.

  Analyze the following chat history and provide a one or two-sentence summary of the current situation. Focus on key events like who is responding, if authorities are involved, and the user's last known status. Do not add any conversational text.

  Chat History:
  {{{chatHistory}}}
  `,
});

const summarizeChatFlow = ai.defineFlow(
  {
    name: 'summarizeChatFlow',
    inputSchema: SummarizeChatInputSchema,
    outputSchema: SummarizeChatOutputSchema,
  },
  async input => {
    const {output} = await summarizeChatPrompt(input);
    return output!;
  }
);
