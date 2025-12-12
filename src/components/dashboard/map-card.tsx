'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast"

export function MapCard() {
  const { toast } = useToast()
  const mapImage = PlaceHolderImages.find((p) => p.id === 'dashboard-map');
  const [showRoute, setShowRoute] = useState(false);

  const handleFindRoute = () => {
    setShowRoute(true);
    toast({
      title: "Safest Route Found",
      description: "We've prioritized your safety. This route avoids all red zones.",
    })
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Intelligent Safety Routing</CardTitle>
        <CardDescription>
          Enter your destination to find the safest route.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
          <div className="relative w-full">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Current Location" className="pl-9" defaultValue="123 Safe St, Your City" />
          </div>
          <ArrowRight className="hidden sm:block text-muted-foreground shrink-0" />
          <div className="relative w-full">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Destination" className="pl-9" defaultValue="800 Secure Ave, Your City" />
          </div>
          <Button onClick={handleFindRoute} className="w-full sm:w-auto">Find Route</Button>
        </div>
        <div className="aspect-[4/3] w-full rounded-lg overflow-hidden relative bg-muted">
          {mapImage && (
            <Image
              src={mapImage.imageUrl}
              alt="Map"
              fill
              className="object-cover"
              data-ai-hint={mapImage.imageHint}
            />
          )}
          {/* Red Zone Overlays */}
          <div className="absolute top-[20%] left-[30%] w-24 h-24 bg-red-500/30 rounded-full animate-pulse border-2 border-red-500" />
          <div className="absolute bottom-[15%] right-[25%] w-20 h-20 bg-red-500/30 rounded-full animate-pulse border-2 border-red-500" />
          
          {/* Safest Route Overlay */}
          <svg
            className={cn(
              'absolute inset-0 w-full h-full transition-opacity duration-1000',
              showRoute ? 'opacity-100' : 'opacity-0'
            )}
            viewBox="0 0 400 300"
            preserveAspectRatio="none"
          >
            <path
              d="M 50 250 Q 150 200, 200 150 T 350 50"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="8 8"
              className="animate-dash"
            />
          </svg>
          <style jsx>{`
            @keyframes dash {
              to {
                stroke-dashoffset: -32;
              }
            }
            .animate-dash {
              animation: dash 1s linear infinite;
            }
          `}</style>
        </div>
      </CardContent>
    </Card>
  );
}
