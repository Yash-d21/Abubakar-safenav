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
import { Timer, ShieldCheck, BellRing, Square, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';

type Status = 'idle' | 'running' | 'alerted';

export function SafetyCheckInCard() {
  const [status, setStatus] = useState<Status>('idle');
  const [timer, setTimer] = useState(0);
  const totalTime = 30; // 30 seconds for demonstration
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (status !== 'running' || timer <= 0) {
      if (status === 'running' && timer <= 0) {
        setStatus('alerted');
        toast({
          variant: 'destructive',
          title: 'Check-in Missed!',
          description: 'An alert has been sent. Activating SOS mode.',
        });
        router.push('/dashboard/sos');
      }
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [status, timer, toast, router]);

  const startCheckIn = () => {
    setTimer(totalTime);
    setStatus('running');
    toast({
      title: 'Safety Check-in Started',
      description: `If you don't check in within ${totalTime} seconds, an alert will be sent.`,
    });
  };

  const markAsSafe = () => {
    setTimer(totalTime); // Reset the timer
    toast({
      title: 'You are Checked In!',
      description: `Your safety check-in was successful. Next check-in is in ${totalTime} seconds.`,
    });
  };
  
  const stopCheckIn = () => {
    setStatus('idle');
    setTimer(0);
    toast({
      title: "Check-in Stopped",
      description: "You have manually stopped the safety check-in.",
    });
  }

  const progress = status === 'running' ? ((totalTime - timer) / totalTime) * 100 : 0;

  const getStatusInfo = () => {
    switch (status) {
      case 'idle':
        return { icon: <Timer className="h-6 w-6" />, text: 'Start a timed safety check-in.' };
      case 'running':
        return { icon: <div className="text-2xl font-bold">{timer}s</div>, text: 'Check in before the timer runs out.' };
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
              <Play className="mr-2 h-4 w-4" />
              Start Check-in
            </Button>
          )}

          {status === 'running' && (
            <div className="flex w-full gap-2">
                <Button onClick={markAsSafe} className="flex-1">
                <ShieldCheck className="mr-2 h-4 w-4" />
                I'm Safe
                </Button>
                <Button onClick={stopCheckIn} variant="secondary" className="flex-1">
                    <Square className="mr-2 h-4 w-4" />
                    Stop Check-in
                </Button>
            </div>
          )}

          {status === 'alerted' && (
            <Button onClick={startCheckIn} variant="outline">
              Start New Check-in
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
