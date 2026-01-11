'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, Share2, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function MapCard() {
  const { toast } = useToast();
  const [isRouteVisible, setIsRouteVisible] = useState(false);
  const [isCheckingHazards, setIsCheckingHazards] = useState(false);
  const [showHazards, setShowHazards] = useState(false);
  
  const mapImage = PlaceHolderImages.find(p => p.id === 'dashboard-map');

  const handleFindRoute = async () => {
    setShowHazards(false);
    setIsRouteVisible(true);
    toast({
      title: "Safest Route Found",
      description: "We've prioritized your safety. This route avoids all red zones.",
    });
  };

  const handleShareTrip = () => {
    toast({
      title: "Trip Shared!",
      description: "A shareable link to your live location has been sent to your guardians.",
    });
  };

  const handleCheckHazards = async () => {
    setIsCheckingHazards(true);
    setTimeout(() => {
        setShowHazards(true);
        toast({
            variant: "destructive",
            title: "Hazard Alert!",
            description: "A water main break has been reported on your route. Hazardous areas are marked in red.",
        });
        setIsCheckingHazards(false);
    }, 1500);
  }

  const hazardLocations = [
    { cx: "70", cy: "80" },
    { cx: "350", cy: "250" },
    { cx: "380", cy: "200" },
  ];

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
            <Input placeholder="Current Location" className="pl-9" defaultValue="123 Safe St, New York, NY" />
          </div>
          <ArrowRight className="hidden sm:block text-muted-foreground shrink-0" />
          <div className="relative w-full">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Destination" className="pl-9" defaultValue="800 Secure Ave, New York, NY" />
          </div>
          <Button onClick={handleFindRoute} className="w-full sm:w-auto">Find Route</Button>
        </div>
        <div className="aspect-[4/3] w-full rounded-lg overflow-hidden relative bg-muted">
           {mapImage ? (
                <Image 
                    src={mapImage.imageUrl}
                    alt="Map of a city"
                    fill
                    style={{ objectFit: 'cover' }}
                    data-ai-hint={mapImage.imageHint}
                />
           ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <p>Map image not available.</p>
                </div>
           )}
            {isRouteVisible && (
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                    <path
                        d="M 50 250 Q 150 200 250 150 T 350 50"
                        stroke="hsl(var(--primary))"
                        strokeWidth="4"
                        fill="none"
                        strokeOpacity="0.8"
                        strokeDasharray="8"
                    >
                         <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="5s" repeatCount="indefinite" />
                    </path>
                    <circle cx="50" cy="250" r="5" fill="hsl(var(--primary))" />
                    <circle cx="350" cy="50" r="5" fill="hsl(var(--primary))" />
                </svg>
            )}
            {showHazards && (
               <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                    {hazardLocations.map((loc, index) => (
                        <circle key={index} cx={loc.cx} cy={loc.cy} r="6" fill="red" stroke="white" strokeWidth="1.5" opacity="0.8">
                           <animate attributeName="r" from="6" to="8" dur="1s" begin={`${index * 0.2}s`} repeatCount="indefinite" />
                           <animate attributeName="opacity" from="0.8" to="0.5" dur="1s" begin={`${index * 0.2}s`} repeatCount="indefinite" />
                        </circle>
                    ))}
                </svg>
            )}
        </div>
      </CardContent>
      {isRouteVisible && (
        <CardFooter className="border-t pt-6 flex-wrap gap-2">
            <Button onClick={handleShareTrip} className="w-full sm:w-auto">
              <Share2 className="mr-2 h-4 w-4" />
              Share Trip with Guardians
            </Button>
            <Button onClick={handleCheckHazards} variant="outline" className="w-full sm:w-auto" disabled={isCheckingHazards}>
                {isCheckingHazards ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <AlertTriangle className="mr-2 h-4 w-4" />}
              Check for Hazards
            </Button>
        </CardFooter>
      )}
    </Card>
  );
}
