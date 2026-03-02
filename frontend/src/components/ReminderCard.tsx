import { useGetSkinTypeDetectionResults } from '../hooks/useQueries';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Bell, X, Calendar } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { getSeasonalTip } from '../utils/seasonalTips';

export default function ReminderCard() {
  const { data: history } = useGetSkinTypeDetectionResults();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const dismissedUntil = localStorage.getItem('reminderDismissedUntil');
    if (dismissedUntil && new Date(dismissedUntil) > new Date()) {
      setDismissed(true);
    }
  }, []);

  if (!history || history.length === 0 || dismissed) {
    return null;
  }

  const latestAnalysis = history[0];
  const latestDate = new Date(Number(latestAnalysis.timestamp));
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const isDue = latestDate < threeMonthsAgo;
  const seasonalTip = getSeasonalTip();

  const handleDismiss = () => {
    const dismissUntil = new Date();
    dismissUntil.setDate(dismissUntil.getDate() + 7);
    localStorage.setItem('reminderDismissedUntil', dismissUntil.toISOString());
    setDismissed(true);
  };

  if (!isDue && !seasonalTip) {
    return null;
  }

  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            {isDue && (
              <div className="mb-4">
                <Badge className="mb-2 bg-amber-600 text-white">Reminder</Badge>
                <h3 className="text-lg font-semibold text-amber-900 mb-2">Time for a Skin Check-In</h3>
                <p className="text-amber-700 mb-3">
                  It's been over 3 months since your last skin analysis. Your skin changes with the seasons and
                  lifestyle—retake the questionnaire to get updated recommendations!
                </p>
                <Button
                  onClick={() => navigate({ to: '/questionnaire' })}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Retake Questionnaire
                </Button>
              </div>
            )}
            {seasonalTip && (
              <div>
                <Badge className="mb-2 bg-teal-600 text-white">Seasonal Tip</Badge>
                <h3 className="text-lg font-semibold text-teal-900 mb-2">{seasonalTip.title}</h3>
                <p className="text-teal-700">{seasonalTip.tip}</p>
              </div>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={handleDismiss} className="text-amber-600 hover:text-amber-700">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
