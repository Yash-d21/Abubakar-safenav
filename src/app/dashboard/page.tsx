import { MapCard } from '@/components/dashboard/map-card';
import { EmergencyPanel } from '@/components/dashboard/emergency-panel';
import { DistressDetectorCard } from '@/components/dashboard/distress-detector-card';
import { SafetyScoreCard } from '@/components/dashboard/safety-score-card';

export default function DashboardPage() {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <MapCard />
        <div className="grid gap-6 md:grid-cols-2">
            <DistressDetectorCard />
            <SafetyScoreCard />
        </div>
      </div>
      <div className="lg:col-span-1">
        <EmergencyPanel />
      </div>
    </div>
  );
}
