import { ConcernLevel } from '../backend';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Droplets, Zap, Clock, Sun } from 'lucide-react';

// Temporary type definition until backend provides SkinTypeData
type SkinTypeData = {
  answers: bigint[];
  detectedSkinType: string;
  concerns: {
    acne: ConcernLevel;
    pigmentation: ConcernLevel;
    aging: ConcernLevel;
    dryness: ConcernLevel;
    concerns: string[];
  };
  timestamp: bigint;
};

interface AnalysisHistoryProps {
  history: SkinTypeData[];
}

const concernIcons = {
  acne: Zap,
  pigmentation: Sun,
  aging: Clock,
  dryness: Droplets,
};

const concernLevelColors = {
  [ConcernLevel.none]: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  [ConcernLevel.low]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  [ConcernLevel.medium]: 'bg-orange-100 text-orange-700 border-orange-200',
  [ConcernLevel.high]: 'bg-red-100 text-red-700 border-red-200',
};

export default function AnalysisHistory({ history }: AnalysisHistoryProps) {
  if (history.length === 0) {
    return (
      <Card className="border-2 border-border rounded-2xl">
        <CardContent className="pt-16 pb-16 text-center">
          <p className="text-muted-foreground text-base">No analysis history yet. Complete the questionnaire to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((entry, index) => {
        const date = new Date(Number(entry.timestamp));
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

        return (
          <Card key={index} className="border-2 border-border hover:shadow-lg hover:border-primary/30 transition-all duration-200 rounded-2xl">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Badge className="bg-primary/10 text-primary border-2 border-primary/30 capitalize font-semibold rounded-lg px-3 py-1">
                    {entry.detectedSkinType} Skin
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">{formattedDate}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {Object.entries({
                  acne: entry.concerns.acne,
                  pigmentation: entry.concerns.pigmentation,
                  aging: entry.concerns.aging,
                  dryness: entry.concerns.dryness,
                }).map(([concern, level]) => {
                  if (level === ConcernLevel.none) return null;
                  const Icon = concernIcons[concern as keyof typeof concernIcons];
                  return (
                    <div key={concern} className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary" />
                      <Badge
                        variant="secondary"
                        className={`text-xs border-2 font-medium rounded-lg px-2.5 py-1 capitalize ${concernLevelColors[level as ConcernLevel]}`}
                      >
                        {concern}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
