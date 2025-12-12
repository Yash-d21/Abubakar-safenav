'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';
import { detectDistress } from '@/ai/flows/detect-distress';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

type Status = 'idle' | 'listening' | 'detecting' | 'confirmed' | 'clear';

export function DistressDetectorCard() {
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<{ isDistressConfirmed: boolean, distressReason?: string } | null>(null);
  const { toast } = useToast();

  const handleSimulateDistress = async () => {
    setStatus('detecting');
    setResult(null);
    try {
      // In a real app, this would come from the device microphone and sensors.
      const mockInput = {
        audioDataUri: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
        accelerometerData: [9.8, 0.5, 0.2], // Simulating a fall
        gyroscopeData: [0.1, 3.5, 0.3], // Simulating sudden rotation
      };
      const response = await detectDistress(mockInput);
      setResult(response);
      if(response.isDistressConfirmed) {
        setStatus('confirmed');
        toast({
          variant: 'destructive',
          title: "Distress Confirmed!",
          description: response.distressReason || "Potential emergency detected from audio and motion."
        });
      } else {
        setStatus('clear');
         toast({
          title: "All Clear",
          description: "No distress detected from simulated event."
        });
      }
    } catch (error) {
      console.error(error);
      setStatus('idle');
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Could not process distress detection."
      });
    }
  };

  const getStatusInfo = () => {
    switch (status) {
      case 'idle':
        return { icon: <Mic className="h-6 w-6" />, text: 'Activate passive monitoring for hands-free safety.' };
      case 'listening':
        return { icon: <Zap className="h-6 w-6 text-green-500 animate-pulse" />, text: 'Monitoring for distress sounds...' };
      case 'detecting':
        return { icon: <Skeleton className="h-6 w-6" />, text: 'Analyzing potential distress event...' };
      case 'confirmed':
        return { icon: <AlertTriangle className="h-6 w-6 text-destructive" />, text: `Distress confirmed: ${result?.distressReason}` };
      case 'clear':
        return { icon: <ShieldCheck className="h-6 w-6 text-green-500" />, text: 'Analysis complete. No distress detected.' };
    }
  };

  const { icon, text } = getStatusInfo();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Hands-Free Activation</CardTitle>
        <CardDescription>AI-powered distress detection.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            {icon}
          </div>
          <p className="text-sm text-muted-foreground min-h-[40px]">{text}</p>
          {status === 'idle' && (
             <Button variant="secondary" onClick={() => setStatus('listening')}>
                <Mic className="mr-2 h-4 w-4" />
                Activate Monitoring
            </Button>
          )}
           {status === 'listening' && (
             <Button variant="outline" onClick={handleSimulateDistress}>
                <Zap className="mr-2 h-4 w-4" />
                Simulate Distress Event
            </Button>
          )}
           {(status === 'confirmed' || status === 'clear') && (
             <Button variant="secondary" onClick={() => setStatus('listening')}>
                Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
