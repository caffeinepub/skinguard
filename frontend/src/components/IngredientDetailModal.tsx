import { IngredientInfo, IngredientSafety } from '../backend';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { AlertCircle, CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';
import { getSafetyLabel } from '../utils/ingredientDatabase';

interface IngredientDetailModalProps {
  ingredient: IngredientInfo;
  onClose: () => void;
}

const safetyConfig: Record<
  IngredientSafety,
  { badgeClass: string; iconClass: string; Icon: React.ElementType; bgClass: string }
> = {
  [IngredientSafety.safe]: {
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    iconClass: 'text-emerald-600',
    Icon: CheckCircle2,
    bgClass: 'bg-emerald-50 border-emerald-100',
  },
  [IngredientSafety.conditional]: {
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    iconClass: 'text-blue-600',
    Icon: Info,
    bgClass: 'bg-blue-50 border-blue-100',
  },
  [IngredientSafety.risky]: {
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    iconClass: 'text-amber-600',
    Icon: AlertTriangle,
    bgClass: 'bg-amber-50 border-amber-100',
  },
  [IngredientSafety.harmful]: {
    badgeClass: 'bg-red-100 text-red-800 border-red-300',
    iconClass: 'text-red-600',
    Icon: XCircle,
    bgClass: 'bg-red-50 border-red-100',
  },
};

export default function IngredientDetailModal({ ingredient, onClose }: IngredientDetailModalProps) {
  const config = safetyConfig[ingredient.safetyClassification];
  const { Icon } = config;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Icon className={`w-6 h-6 ${config.iconClass}`} />
            <DialogTitle className="text-2xl text-emerald-900">{ingredient.name}</DialogTitle>
          </div>
          <Badge className={`w-fit border font-semibold px-3 py-1 ${config.badgeClass}`}>
            {getSafetyLabel(ingredient.safetyClassification)}
          </Badge>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Safety Notice for harmful/risky */}
            {(ingredient.safetyClassification === IngredientSafety.harmful ||
              ingredient.safetyClassification === IngredientSafety.risky) && (
              <div className={`flex items-start gap-3 p-3 rounded-lg border ${config.bgClass}`}>
                <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${config.iconClass}`} />
                <div>
                  <p className="font-semibold text-sm text-gray-800">
                    {ingredient.safetyClassification === IngredientSafety.harmful
                      ? 'This ingredient is considered harmful for skin'
                      : 'Use this ingredient with caution'}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {ingredient.safetyClassification === IngredientSafety.harmful
                      ? 'It may cause irritation, barrier damage, or other adverse effects.'
                      : 'It may cause irritation or adverse effects in some skin types.'}
                  </p>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-base font-semibold text-emerald-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed text-sm">{ingredient.description}</p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-emerald-900 mb-2">Suitable Skin Types</h3>
              {ingredient.suitableSkinTypes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {ingredient.suitableSkinTypes.map((skinType, index) => (
                    <Badge key={index} className="bg-emerald-100 text-emerald-700 border-emerald-200 capitalize">
                      {skinType}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-red-600 font-medium">Not recommended for any skin type</p>
              )}
            </div>

            {(ingredient.isAcneProneConcern || ingredient.isSensitiveConcern || ingredient.isClogProneConcern) && (
              <div>
                <h3 className="text-base font-semibold text-emerald-900 mb-2">Skin Concerns</h3>
                <div className="space-y-2">
                  {ingredient.isAcneProneConcern && (
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-purple-50 border border-purple-100">
                      <AlertCircle className="w-4 h-4 text-purple-600 shrink-0" />
                      <span className="text-sm text-purple-700">May trigger acne in acne-prone individuals</span>
                    </div>
                  )}
                  {ingredient.isSensitiveConcern && (
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 border border-rose-100">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span className="text-sm text-rose-700">May cause sensitivity or irritation reactions</span>
                    </div>
                  )}
                  {ingredient.isClogProneConcern && (
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-100">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="text-sm text-amber-700">May clog pores and cause breakouts</span>
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
