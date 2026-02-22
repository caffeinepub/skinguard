import { useGetProgressMetrics } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import TrendChart from './TrendChart';

export default function ProgressTracker() {
  const { data: metrics, isLoading } = useGetProgressMetrics();

  if (isLoading) {
    return (
      <Card className="border-emerald-200">
        <CardContent className="pt-12 pb-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return null;
  }

  const trends = [
    { name: 'Acne', trend: metrics.acneTrend, color: 'purple' },
    { name: 'Pigmentation', trend: metrics.pigmentationTrend, color: 'amber' },
    { name: 'Aging', trend: metrics.agingTrend, color: 'rose' },
    { name: 'Dryness', trend: metrics.drynessTrend, color: 'blue' },
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === 'Improvement') return TrendingUp;
    if (trend === 'Decline') return TrendingDown;
    return Minus;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'Improvement') return 'text-green-600 bg-green-100';
    if (trend === 'Decline') return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <Card className="border-emerald-200 shadow-lg">
      <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50">
        <CardTitle className="text-2xl text-emerald-900">Progress Tracking</CardTitle>
        <CardDescription className="text-emerald-700">
          Monitor how your skin concerns are changing over time
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {trends.map((item) => {
            const Icon = getTrendIcon(item.trend);
            return (
              <div key={item.name} className="p-4 rounded-lg border border-emerald-100 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-emerald-900">{item.name}</h4>
                  <Icon className={`w-5 h-5 ${getTrendColor(item.trend).split(' ')[0]}`} />
                </div>
                <Badge className={getTrendColor(item.trend)}>
                  {item.trend}
                </Badge>
              </div>
            );
          })}
        </div>

        {metrics.acneTrend !== 'No data' && (
          <div className="mt-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
            <p className="text-sm text-emerald-700">
              <strong>Insight:</strong> Your skin analysis shows{' '}
              {trends.filter((t) => t.trend === 'Improvement').length > 0
                ? `improvement in ${trends.filter((t) => t.trend === 'Improvement').map((t) => t.name.toLowerCase()).join(', ')}`
                : 'stable skin health'}
              . Keep up with your skincare routine!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
