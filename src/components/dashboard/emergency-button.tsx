'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { EmergencyDialog } from './emergency-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function EmergencyButton() {
  const [isEmergency, setIsEmergency] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              className="w-full h-12 rounded-full shadow-lg bg-accent hover:bg-accent/90 text-accent-foreground text-lg font-bold flex items-center justify-center gap-2 transition-transform active:scale-95"
              style={{
                '--tw-bg-opacity': '1',
                backgroundColor: 'hsl(var(--accent))',
              }}
              onMouseDown={() => setIsEmergency(true)}
            >
              <ShieldAlert className="w-6 h-6" />
              <span className="group-data-[collapsible=icon]:hidden">SOS</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" align="center">
            Emergency SOS
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <EmergencyDialog open={isEmergency} onOpenChange={setIsEmergency} />
    </>
  );
}
