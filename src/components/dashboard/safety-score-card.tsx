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
import { ShieldQuestion, Loader2 } from 'lucide-react';
import { generateSafetyScore, type GenerateSafetyScoreOutput } from '@/ai/flows/generate-safety-score';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export function SafetyScoreCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [scoreData, setScoreData] = useState<GenerateSafetyScoreOutput | null>(null);
  const { toast } = useToast();

  const handleGetScore = async () => {
    setIsLoading(true);
    setScoreData(null);
    try {
      const mockInput = {
        locationDescription: 'Downtown crossing, main city square.',
        crimeData: 'Reports of 3 thefts and 1 public disturbance in the last 48 hours.',
        newsData: 'Local blog mentioned increased police presence due to a recent festival.',
        userReports: 'One user reported poor lighting near the subway entrance at night.',
      };
      const response = await generateSafetyScore(mockInput);
      setScoreData(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not generate safety score.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getScoreColor = (score: number | undefined) => {
    if (score === undefined) return 'bg-gray-500';
    if (score <= 3) return 'bg-red-500';
    if (score <= 6) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Dynamic Red Zone AI</CardTitle>
        <CardDescription>Real-time threat assessment.</CardDescription>
      </CardHeader>
      <CardContent>
        {scoreData ? (
          <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Downtown Crossing Safety Score</p>
                 <Badge className={`${getScoreColor(scoreData.safetyScore)} text-white`}>
                    {scoreData.safetyScore}/10
                </Badge>
              </div>
            <p className="text-sm text-muted-foreground border-l-2 pl-4">{scoreData.reason}</p>
            <Button variant="secondary" onClick={() => setScoreData(null)} className="w-full">
              Check Another Location
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <ShieldQuestion className="h-6 w-6" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Check AI-generated safety scores for any location.
            </p>
            <Button onClick={handleGetScore} disabled={isLoading} className="w-full">
              {isLoading ? 'Analyzing...' : 'Check Downtown Safety'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
