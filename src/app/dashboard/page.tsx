import { MapCard } from '@/components/dashboard/map-card';
import { DistressDetectorCard } from '@/components/dashboard/distress-detector-card';
import { SafetyScoreCard } from '@/components/dashboard/safety-score-card';
import { SafetyCheckInCard } from '@/components/dashboard/safety-check-in-card';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
        <MapCard />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DistressDetectorCard />
            <SafetyScoreCard />
            <SafetyCheckInCard />
        </div>
    </div>
  );
}
