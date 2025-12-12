'use client';

import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { useToast } from "@/hooks/use-toast"

type EmergencyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EmergencyDialog({ open, onOpenChange }: EmergencyDialogProps) {
  const [countdown, setCountdown] = useState(10);
  const { toast } = useToast();

  useEffect(() => {
    if (!open) {
      setCountdown(10);
      return;
    }

    if (countdown <= 0) {
      onOpenChange(false);
      toast({
        variant: "destructive",
        title: "Emergency Alert Sent!",
        description: "Authorities and your guardians have been notified.",
      });
      return;
    }

    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, open, onOpenChange, toast]);

  const handleSafe = () => {
    onOpenChange(false);
    toast({
      title: "Alert Cancelled",
      description: "Your emergency alert has been successfully cancelled.",
    })
  }

  const progress = (countdown / 10) * 100;

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
          <AlertDialogAction
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            onClick={handleSafe}
          >
            I&apos;m Safe
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
