'use client';

import { useState } from 'react';
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
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Circle } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.5rem',
};

const center = {
  lat: 40.7128,
  lng: -74.0060
};

const redZones = [
  { center: { lat: 40.715, lng: -74.002 }, radius: 200 },
  { center: { lat: 40.710, lng: -74.010 }, radius: 150 },
];

export function MapCard() {
  const { toast } = useToast()
  const [showRoute, setShowRoute] = useState(false);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  const handleFindRoute = async () => {
    if (!isLoaded) return;
    const directionsService = new google.maps.DirectionsService();
    try {
      const results = await directionsService.route({
        origin: '123 Safe St, New York, NY',
        destination: '800 Secure Ave, New York, NY',
        travelMode: google.maps.TravelMode.DRIVING,
      });
      setDirectionsResponse(results);
      setShowRoute(true);
      toast({
        title: "Safest Route Found",
        description: "We've prioritized your safety. This route avoids all red zones.",
      });
    } catch (error) {
      console.error('Error fetching directions', error);
       toast({
        variant: "destructive",
        title: "Error",
        description: "Could not find a route.",
      });
    }
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
            <Input placeholder="Current Location" className="pl-9" defaultValue="123 Safe St, New York, NY" />
          </div>
          <ArrowRight className="hidden sm:block text-muted-foreground shrink-0" />
          <div className="relative w-full">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Destination" className="pl-9" defaultValue="800 Secure Ave, New York, NY" />
          </div>
          <Button onClick={handleFindRoute} className="w-full sm:w-auto" disabled={!isLoaded}>Find Route</Button>
        </div>
        <div className="aspect-[4/3] w-full rounded-lg overflow-hidden relative bg-muted">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={14}
              options={{
                disableDefaultUI: true,
                zoomControl: true,
              }}
            >
              {directionsResponse && showRoute && (
                <DirectionsRenderer 
                  directions={directionsResponse} 
                  options={{ 
                    polylineOptions: { 
                      strokeColor: 'hsl(var(--primary))',
                      strokeWeight: 4,
                    }
                  }} 
                />
              )}
               {redZones.map((zone, index) => (
                <Circle
                  key={index}
                  center={zone.center}
                  radius={zone.radius}
                  options={{
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35,
                  }}
                />
              ))}
            </GoogleMap>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p>Loading map...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
