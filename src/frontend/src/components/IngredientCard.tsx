import { useState } from 'react';
import { IngredientInfo, IngredientSafety } from '../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import IngredientDetailModal from './IngredientDetailModal';

interface IngredientCardProps {
  ingredient: IngredientInfo;
}

const safetyColors: Record<IngredientSafety, string> = {
  [IngredientSafety.safe]: 'bg-green-100 text-green-700 border-green-200',
  [IngredientSafety.conditional]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  [IngredientSafety.risky]: 'bg-orange-100 text-orange-700 border-orange-200',
  [IngredientSafety.harmful]: 'bg-red-100 text-red-700 border-red-200',
};

export default function IngredientCard({ ingredient }: IngredientCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card
        className="border-2 border-border hover:shadow-xl hover:border-primary/30 transition-all duration-200 cursor-pointer rounded-2xl"
        onClick={() => setShowModal(true)}
      >
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-lg font-semibold text-foreground leading-tight">{ingredient.name}</CardTitle>
            <Badge className={`${safetyColors[ingredient.safetyClassification]} border-2 font-semibold rounded-lg px-3 py-1 capitalize`}>
              {ingredient.safetyClassification}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{ingredient.description}</p>
          <div className="flex flex-wrap gap-2">
            {ingredient.isAcneProneConcern && (
              <Badge variant="outline" className="text-xs border-2 border-purple-200 text-purple-700 font-medium rounded-lg px-2.5 py-1">
                Acne-prone
              </Badge>
            )}
            {ingredient.isSensitiveConcern && (
              <Badge variant="outline" className="text-xs border-2 border-rose-200 text-rose-700 font-medium rounded-lg px-2.5 py-1">
                Sensitive
              </Badge>
            )}
            {ingredient.isClogProneConcern && (
              <Badge variant="outline" className="text-xs border-2 border-amber-200 text-amber-700 font-medium rounded-lg px-2.5 py-1">
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
