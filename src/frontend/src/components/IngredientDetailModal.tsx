import { IngredientInfo, IngredientSafety } from '../backend';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface IngredientDetailModalProps {
  ingredient: IngredientInfo;
  onClose: () => void;
}

const safetyColors: Record<IngredientSafety, string> = {
  [IngredientSafety.safe]: 'bg-green-100 text-green-700',
  [IngredientSafety.conditional]: 'bg-yellow-100 text-yellow-700',
  [IngredientSafety.risky]: 'bg-orange-100 text-orange-700',
  [IngredientSafety.harmful]: 'bg-red-100 text-red-700',
};

const safetyIcons: Record<IngredientSafety, typeof CheckCircle2> = {
  [IngredientSafety.safe]: CheckCircle2,
  [IngredientSafety.conditional]: AlertCircle,
  [IngredientSafety.risky]: AlertCircle,
  [IngredientSafety.harmful]: XCircle,
};

export default function IngredientDetailModal({ ingredient, onClose }: IngredientDetailModalProps) {
  const Icon = safetyIcons[ingredient.safetyClassification];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Icon className={`w-6 h-6 ${safetyColors[ingredient.safetyClassification].split(' ')[1]}`} />
            <DialogTitle className="text-2xl text-emerald-900">{ingredient.name}</DialogTitle>
          </div>
          <Badge className={`w-fit ${safetyColors[ingredient.safetyClassification]}`}>
            {ingredient.safetyClassification}
          </Badge>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-emerald-900 mb-2">Description</h3>
              <p className="text-emerald-700 leading-relaxed">{ingredient.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-emerald-900 mb-2">Suitable Skin Types</h3>
              <div className="flex flex-wrap gap-2">
                {ingredient.suitableSkinTypes.map((skinType, index) => (
                  <Badge key={index} className="bg-emerald-100 text-emerald-700 capitalize">
                    {skinType}
                  </Badge>
                ))}
              </div>
            </div>

            {(ingredient.isAcneProneConcern || ingredient.isSensitiveConcern || ingredient.isClogProneConcern) && (
              <div>
                <h3 className="text-lg font-semibold text-emerald-900 mb-2">Concerns</h3>
                <div className="space-y-2">
                  {ingredient.isAcneProneConcern && (
                    <div className="flex items-center gap-2 p-2 rounded bg-purple-50">
                      <AlertCircle className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-purple-700">May trigger acne in prone individuals</span>
                    </div>
                  )}
                  {ingredient.isSensitiveConcern && (
                    <div className="flex items-center gap-2 p-2 rounded bg-rose-50">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span className="text-sm text-rose-700">May cause sensitivity or irritation</span>
                    </div>
                  )}
                  {ingredient.isClogProneConcern && (
                    <div className="flex items-center gap-2 p-2 rounded bg-amber-50">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span className="text-sm text-amber-700">May clog pores</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
