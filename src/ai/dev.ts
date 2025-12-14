import { config } from 'dotenv';
config();

import '@/ai/flows/generate-safety-score.ts';
import '@/ai/flows/detect-distress.ts';
import '@/ai/flows/generate-route.ts';
import '@/ai/flows/summarize-chat.ts';
import '@/ai/flows/detect-hazards.ts';
