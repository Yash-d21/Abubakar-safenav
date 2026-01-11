'use client';

import { useState, useEffect } from 'react';
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
import { ArrowRight, MapPin, Share2, AlertTriangle, Loader2, Shield, Hospital } from 'lucide-react';
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

    // Start the safety check-in timer
    setTimeout(() => {
        toast({
            title: "Are you still there?",
            description: "We've noticed you haven't moved in a while. Tap to confirm you're okay.",
            duration: 20000, // 20 seconds to respond
            action: (
                <Button variant="secondary" onClick={() => {
                    toast({
                        title: "Thanks for checking in!",
                        description: "We'll continue to monitor your trip.",
                    });
                }}>
                    I'm Safe
                </Button>
            ),
        });
    }, 20000); // 20 seconds after route is found
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
            description: "A water main break has been reported near your route. Hazardous areas are marked in red.",
        });
        setIsCheckingHazards(false);
    }, 1500);
  }

  const hazardLocations = [
    { cx: "120", cy: "150" },
    { cx: "300", cy: "200" },
  ];

  const safePois = [
      { component: Shield, x: 160, y: 190, color: 'blue', label: 'Police' },
      { component: Hospital, x: 270, y: 110, color: 'green', label: 'Hospital' },
  ]

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
                    {/* The Route Path */}
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

                    {/* Safe POI Icons */}
                    {safePois.map((Poi, index) => (
                        <g key={index} transform={`translate(${Poi.x - 12}, ${Poi.y - 12})`}>
                            <rect x="0" y="0" width="24" height="24" rx="6" fill="white" stroke={Poi.color} strokeWidth="2" />
                            <Poi.component className="text-foreground" x="4" y="4" width="16" height="16" stroke={Poi.color} />
                             <text x="30" y="16" fontSize="10" fontWeight="bold" fill="black" stroke="white" strokeWidth="0.3px" paintOrder="stroke">{Poi.label}</text>
                        </g>
                    ))}
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
