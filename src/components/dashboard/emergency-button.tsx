'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { EmergencyDialog } from './emergency-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export function EmergencyButton() {
  const [isEmergency, setIsEmergency] = useState(false);

  return (
    <>
      <Card className="bg-destructive/10 border-destructive/50 text-destructive-foreground group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:border-0">
        <CardHeader className="p-3 group-data-[collapsible=icon]:p-0">
          <CardTitle className="text-base group-data-[collapsible=icon]:hidden">Emergency</CardTitle>
          <CardDescription className="text-destructive-foreground/80 text-xs group-data-[collapsible=icon]:hidden">
            Press and hold to send an alert to your guardians and authorities.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0 flex flex-col items-center justify-center">
          <Button
            variant="destructive"
            className="w-full h-24 rounded-lg shadow-lg bg-accent hover:bg-accent/90 text-accent-foreground text-lg font-bold flex flex-col items-center justify-center gap-2 transition-transform active:scale-95 group-data-[collapsible=icon]:h-16 group-data-[collapsible=icon]:w-16"
            style={{
              '--tw-bg-opacity': '1',
              backgroundColor: 'hsl(var(--accent))',
            }}
            onMouseDown={() => setIsEmergency(true)}
          >
            <ShieldAlert className="w-8 h-8" />
            <span>SOS</span>
          </Button>
           <p className="text-destructive-foreground/80 text-xs mt-2 text-center group-data-[collapsible=icon]:hidden">
            When activated, your live location will be shared.
          </p>
        </CardContent>
      </Card>

      <EmergencyDialog open={isEmergency} onOpenChange={setIsEmergency} />
    </>
  );
}
