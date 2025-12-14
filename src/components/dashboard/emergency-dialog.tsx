'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { useToast } from "@/hooks/use-toast"
import { Button } from '../ui/button';

type EmergencyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EmergencyDialog({ open, onOpenChange }: EmergencyDialogProps) {
  const [countdown, setCountdown] = useState(5);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!open) {
      setCountdown(5);
      return;
    }

    if (countdown <= 0) {
      onOpenChange(false);
      toast({
        variant: "destructive",
        title: "Emergency Alert Sent!",
        description: "Authorities and your guardians have been notified. Activating SOS mode.",
      });
      router.push('/dashboard/sos');
      return;
    }

    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, open, onOpenChange, toast, router]);

  const handleSafe = () => {
    onOpenChange(false);
    toast({
      title: "Alert Cancelled",
      description: "Your emergency alert has been successfully cancelled.",
    })
  }

  const progress = (countdown / 5) * 100;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center font-headline text-2xl">
            Confirming Emergency
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            An alert will be sent to authorities and your guardians in...
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <div className="text-6xl font-bold text-center text-destructive">{countdown}</div>
          <Progress value={progress} className="w-full" />
        </div>
        <AlertDialogFooter className="sm:justify-center">
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={handleSafe}
          >
            I&apos;m Safe (Cancel)
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
