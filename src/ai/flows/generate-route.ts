'use server';
/**
 * @fileOverview This file defines a Genkit flow to generate a route using the HERE Router API.
 *
 * - generateRoute - An async function that takes an origin and destination and returns a route.
 * - GenerateRouteInput - The input type for the generateRoute function.
 * - GenerateRouteOutput - The return type for the generateRoute function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRouteInputSchema = z.object({
  origin: z.string().describe('The starting point of the route (e.g., "lat,lng").'),
  destination: z.string().describe('The destination of the route (e.g., "lat,lng").'),
  transportMode: z.string().describe('The mode of transport (e.g., "car", "pedestrian").'),
  avoid: z.array(z.object({
    lat: z.number(),
    lng: z.number(),
    radius: z.number(),
  })).optional().describe('Areas to avoid.'),
});

export type GenerateRouteInput = z.infer<typeof GenerateRouteInputSchema>;

const GenerateRouteOutputSchema = z.object({
  polyline: z.array(z.object({lat: z.number(), lng: z.number()})),
});

export type GenerateRouteOutput = z.infer<typeof GenerateRouteOutputSchema>;

const hereApiKey = process.env.NEXT_PUBLIC_HERE_API_KEY;

export async function generateRoute(input: GenerateRouteInput): Promise<GenerateRouteOutput> {
  return generateRouteFlow(input);
}

function decodeFlexiblePolyline(encoded: string) {
  const polyline: {lat: number, lng: number}[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    polyline.push({ lat: lat / 100000, lng: lng / 100000 });
  }
  return polyline;
}


const generateRouteFlow = ai.defineFlow(
  {
    name: 'generateRouteFlow',
    inputSchema: GenerateRouteInputSchema,
    outputSchema: GenerateRouteOutputSchema,
  },
  async (input) => {
    if (!hereApiKey) {
      throw new Error("HERE API key is not configured.");
    }
    
    let avoidQuery = '';
    if (input.avoid && input.avoid.length > 0) {
        const bboxString = input.avoid.map(zone => {
            const north = zone.lat + zone.radius / 111111;
            const south = zone.lat - zone.radius / 111111;
            const east = zone.lng + zone.radius / (111111 * Math.cos(zone.lat * Math.PI / 180));
            const west = zone.lng - zone.radius / (111111 * Math.cos(zone.lat * Math.PI / 180));
            return `${north},${west},${south},${east}`;
        }).join(';');
        avoidQuery = `&avoid[areas]=bbox:${bboxString}`;
    }

    const url = `https://router.hereapi.com/v8/routes?transportMode=${input.transportMode}&origin=${input.origin}&destination=${input.destination}&return=polyline${avoidQuery}&apiKey=${hereApiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
        console.error("HERE API Error:", data);
        throw new Error(data.title || 'Failed to fetch route from HERE API');
    }

    const polyline = data.routes[0].sections[0].polyline;
    const decodedPolyline = decodeFlexiblePolyline(polyline);
    
    return { polyline: decodedPolyline };
  }
);
