'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';
import { EmergencyDialog } from './emergency-dialog';

export function EmergencyPanel() {
  const [isEmergency, setIsEmergency] = useState(false);

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Emergency</CardTitle>
          <CardDescription>
            Press and hold to send an alert to your guardians and authorities.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col items-center justify-center p-6">
          <div className="relative w-48 h-48">
            <Button
              variant="destructive"
              className="absolute inset-0 w-full h-full rounded-full shadow-2xl bg-accent hover:bg-accent/90 text-accent-foreground text-lg font-bold flex flex-col gap-1 transition-transform active:scale-95"
              style={{
                '--tw-bg-opacity': '1',
                backgroundColor: 'hsl(var(--accent))',
              }}
              onMouseDown={() => setIsEmergency(true)}
            >
              <ShieldAlert className="w-12 h-12" />
              <span>SOS</span>
            </Button>
          </div>
          <p className="text-muted-foreground text-sm mt-8 text-center">
            When activated, your live location will be shared.
          </p>
        </CardContent>
      </Card>
      <EmergencyDialog open={isEmergency} onOpenChange={setIsEmergency} />
    </>
  );
}
