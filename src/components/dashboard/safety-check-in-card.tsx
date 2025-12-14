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
import { Timer, ShieldCheck, BellRing } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

type Status = 'idle' | 'running' | 'safe' | 'alerted';

export function SafetyCheckInCard() {
  const [status, setStatus] = useState<Status>('idle');
  const [timer, setTimer] = useState(0);
  const totalTime = 30; // 30 seconds for demonstration
  const { toast } = useToast();

  useEffect(() => {
    if (status !== 'running' || timer <= 0) {
      if (status === 'running' && timer <= 0) {
        setStatus('alerted');
        toast({
          variant: 'destructive',
          title: 'Check-in Missed!',
          description: 'An alert has been sent to your guardians.',
        });
      }
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [status, timer, toast]);

  const startCheckIn = () => {
    setTimer(totalTime);
    setStatus('running');
    toast({
      title: 'Safety Check-in Started',
      description: `If you don't check in within ${totalTime} seconds, an alert will be sent.`,
    });
  };

  const markAsSafe = () => {
    setStatus('safe');
    setTimer(0);
    toast({
      title: 'You are Checked In!',
      description: 'Your safety check-in was successful.',
    });
  };
  
  const reset = () => {
    setStatus('idle');
    setTimer(0);
  }

  const progress = status === 'running' ? ((totalTime - timer) / totalTime) * 100 : 0;

  const getStatusInfo = () => {
    switch (status) {
      case 'idle':
        return { icon: <Timer className="h-6 w-6" />, text: 'Start a timed safety check-in.' };
      case 'running':
        return { icon: <div className="text-2xl font-bold">{timer}s</div>, text: 'Check in before the timer runs out.' };
      case 'safe':
        return { icon: <ShieldCheck className="h-6 w-6 text-green-500" />, text: 'You have successfully checked in.' };
      case 'alerted':
        return { icon: <BellRing className="h-6 w-6 text-destructive" />, text: 'Check-in missed. Alert sent.' };
    }
  };

  const { icon, text } = getStatusInfo();

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="font-headline">Safety Check-in</CardTitle>
        <CardDescription>Automatic alerts if you don't check in.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            {icon}
          </div>
          <p className="text-sm text-muted-foreground min-h-[40px]">{text}</p>
          {status === 'running' && <Progress value={progress} className="w-full" />}
          
          {status === 'idle' && (
            <Button onClick={startCheckIn}>
              <Timer className="mr-2 h-4 w-4" />
              Start 30s Check-in
            </Button>
          )}

          {status === 'running' && (
            <Button onClick={markAsSafe} variant="secondary">
              <ShieldCheck className="mr-2 h-4 w-4" />
              I'm Safe
            </Button>
          )}

          {(status === 'safe' || status === 'alerted') && (
            <Button onClick={reset} variant="outline">
              Start New Check-in
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
