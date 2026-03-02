import { useState } from 'react';
import { IngredientInfo, IngredientSafety } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import IngredientDetailModal from './IngredientDetailModal';
import { getSafetyLabel } from '../utils/ingredientDatabase';

interface IngredientCardProps {
  ingredient: IngredientInfo;
}

const safetyStyles: Record<IngredientSafety, { badge: string; border: string }> = {
  [IngredientSafety.safe]: {
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-100',
    border: 'border-emerald-200 hover:border-emerald-400',
  },
  [IngredientSafety.conditional]: {
    badge: 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-100',
    border: 'border-blue-200 hover:border-blue-400',
  },
  [IngredientSafety.risky]: {
    badge: 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-100',
    border: 'border-amber-200 hover:border-amber-400',
  },
  [IngredientSafety.harmful]: {
    badge: 'bg-red-100 text-red-800 border-red-300 hover:bg-red-100',
    border: 'border-red-200 hover:border-red-400',
  },
};

const safetyIcons: Record<IngredientSafety, React.ReactNode> = {
  [IngredientSafety.safe]: <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />,
  [IngredientSafety.conditional]: <Info className="w-4 h-4 text-blue-600 shrink-0" />,
  [IngredientSafety.risky]: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />,
  [IngredientSafety.harmful]: <XCircle className="w-4 h-4 text-red-600 shrink-0" />,
};

export default function IngredientCard({ ingredient }: IngredientCardProps) {
  const [showModal, setShowModal] = useState(false);
  const styles = safetyStyles[ingredient.safetyClassification];

  return (
    <>
      <Card
        className={`border-2 ${styles.border} hover:shadow-xl transition-all duration-200 cursor-pointer rounded-2xl`}
        onClick={() => setShowModal(true)}
      >
        <CardHeader className="space-y-3 pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              {safetyIcons[ingredient.safetyClassification]}
              <CardTitle className="text-base font-semibold text-foreground leading-tight truncate">
                {ingredient.name}
              </CardTitle>
            </div>
            <Badge
              className={`${styles.badge} border font-semibold rounded-lg px-2.5 py-1 text-xs shrink-0`}
            >
              {getSafetyLabel(ingredient.safetyClassification)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{ingredient.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {ingredient.isAcneProneConcern && (
              <Badge variant="outline" className="text-xs border border-purple-200 text-purple-700 font-medium rounded-lg px-2 py-0.5">
                Acne-prone
              </Badge>
            )}
            {ingredient.isSensitiveConcern && (
              <Badge variant="outline" className="text-xs border border-rose-200 text-rose-700 font-medium rounded-lg px-2 py-0.5">
                Sensitive
              </Badge>
            )}
            {ingredient.isClogProneConcern && (
              <Badge variant="outline" className="text-xs border border-amber-200 text-amber-700 font-medium rounded-lg px-2 py-0.5">
                Clog-prone
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {showModal && <IngredientDetailModal ingredient={ingredient} onClose={() => setShowModal(false)} />}
    </>
  );
}
