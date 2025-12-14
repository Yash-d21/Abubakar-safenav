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
  const [timer, setTimer] = useState(0);
  const { toast } = useToast();
  const tripDuration = 120; // 2 minutes for demonstration

  useEffect(() => {
    if (status !== 'active' || timer <= 0) {
        if(status === 'active' && timer <= 0){
            setStatus('safe');
            toast({
                title: 'You have arrived!',
                description: '"Follow Me Home" mode has ended.',
            });
        }
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    
    if(timer > 0 && timer % 30 === 0) {
        toast({
            title: "Are you still there?",
            description: "We've noticed you haven't moved in a while. Tap to confirm you're okay.",
            duration: 10000
        })
    }


    return () => clearInterval(interval);
  }, [status, timer, toast]);
  
  const handleStart = () => {
    setStatus('active');
    setTimer(tripDuration);
    toast({
      title: '"Follow Me Home" Activated',
      description: "We'll monitor your trip and check in if you stop for too long.",
    });
  }

  const handleEnd = () => {
      setStatus('safe');
      setTimer(0);
      toast({
          title: 'You have arrived!',
          description: 'You have manually ended the "Follow Me Home" mode.',
      });
  }

  const progress = status === 'active' ? ((tripDuration - timer) / tripDuration) * 100 : 0;
  const minutesLeft = Math.floor(timer / 60);
  const secondsLeft = timer % 60;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Follow Me Home</CardTitle>
        <CardDescription>Lightweight monitoring for everyday trips.</CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'idle' && (
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Route className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground">Start a monitored trip to your destination for added peace of mind.</p>
            <Button onClick={handleStart}>
              <MapPin className="mr-2 h-4 w-4" />
              Start a Trip
            </Button>
          </div>
        )}
        {status === 'active' && (
           <div className="flex flex-col items-center text-center gap-4">
             <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <div className="text-xl font-bold tabular-nums">
                {String(minutesLeft).padStart(2, '0')}:{String(secondsLeft).padStart(2, '0')}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Trip in progress. We will check in if you stop moving.</p>
             <Progress value={progress} className="w-full" />
            <Button onClick={handleEnd} variant="secondary">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Arrived Safely
            </Button>
           </div>
        )}
        {(status === 'safe') && (
            <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-green-500" />
                </div>
                <p className="text-sm text-muted-foreground">You have safely arrived at your destination.</p>
                 <Button onClick={() => setStatus('idle')} variant="outline">
                    Start New Trip
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
