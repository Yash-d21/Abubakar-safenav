'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Route, ShieldCheck, Timer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

type Status = 'idle' | 'active' | 'safe';

export function FollowMeHomeCard() {
  const [status, setStatus] = useState<Status>('idle');
  const { toast } = useToast();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Follow Me Home</CardTitle>
        <CardDescription>Automatic monitoring during active trips.</CardDescription>
      </CardHeader>
      <CardContent>
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Route className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground">When you start a route, this feature will automatically monitor your trip and check in if you stop moving for too long.</p>
          </div>
      </CardContent>
    </Card>
  );
}
