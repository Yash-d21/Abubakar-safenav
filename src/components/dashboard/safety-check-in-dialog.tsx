'use client';

import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '../ui/button';

type SafetyCheckInDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmSafe: () => void;
};

export function SafetyCheckInDialog({ open, onOpenChange, onConfirmSafe }: SafetyCheckInDialogProps) {
  const [countdown, setCountdown] = useState(20);
  const totalTime = 20;

  useEffect(() => {
    if (!open) {
      setCountdown(totalTime);
      return;
    }

    if (countdown <= 0) {
      // In a real app, this would trigger an emergency alert.
      // For now, we'll just close the dialog.
      onOpenChange(false);
      return;
    }

    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, open, onOpenChange]);

  const handleSafeClick = () => {
    onConfirmSafe();
    onOpenChange(false);
  }

  const progress = (countdown / totalTime) * 100;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center font-headline text-2xl">
            Are you still there?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            We've noticed you haven't moved in a while. Please confirm you're safe. An alert will be sent if you don't respond.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <div className="text-6xl font-bold text-center text-primary">{countdown}</div>
          <Progress value={progress} className="w-full" />
        </div>
        <AlertDialogFooter className="sm:justify-center">
          <Button
            variant="default"
            className="w-full sm:w-auto"
            onClick={handleSafeClick}
          >
            I'm Safe
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
