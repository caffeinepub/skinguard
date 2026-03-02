interface TrendChartProps {
  concernName: string;
  currentLevel: number;
  trend: string;
}

export default function TrendChart({ concernName, currentLevel, trend }: TrendChartProps) {
  const getTrendColor = () => {
    if (trend === 'Improvement') return 'oklch(0.65 0.14 145)';
    if (trend === 'Decline') return 'oklch(0.60 0.22 25)';
    return 'oklch(0.70 0.08 160)';
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(currentLevel / 3) * 100}%`,
              backgroundColor: getTrendColor(),
            }}
          />
        </div>
      </div>
      <span className="text-sm font-medium text-emerald-700">{concernName}</span>
    </div>
  );
}
