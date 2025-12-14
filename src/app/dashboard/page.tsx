import { MapCard } from '@/components/dashboard/map-card';
import { DistressDetectorCard } from '@/components/dashboard/distress-detector-card';
import { SafetyScoreCard } from '@/components/dashboard/safety-score-card';
import { SafetyCheckInCard } from '@/components/dashboard/safety-check-in-card';
import { FollowMeHomeCard } from '@/components/dashboard/follow-me-home-card';

export default function DashboardPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <MapCard />
        </div>
        <div className="space-y-6 lg:col-span-1">
            <SafetyScoreCard />
            <SafetyCheckInCard />
            <FollowMeHomeCard />
            <DistressDetectorCard />
        </div>
    </div>
  );
}
