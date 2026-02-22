import { SkincareProduct, PriceRange } from '../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Heart, Droplets, Zap, Clock, Sun, Star } from 'lucide-react';
import { useAddFavorite, useRemoveFavorite, useGetFavorites, useGetProductNotes } from '../hooks/useQueries';
import { useState } from 'react';
import ProductNoteModal from './ProductNoteModal';

interface ProductCardProps {
  product: SkincareProduct;
  showCompareCheckbox?: boolean;
  isSelected?: boolean;
  onSelectChange?: (selected: boolean) => void;
}

const priceRangeLabels: Record<PriceRange, string> = {
  [PriceRange.low]: '$0-$20',
  [PriceRange.medium]: '$20-$50',
  [PriceRange.high]: '$50+',
};

const concernConfig: Record<string, { label: string; icon: typeof Zap; color: string }> = {
  acne: { label: 'Anti-Acne', icon: Zap, color: 'bg-purple-100 text-purple-700 border-purple-200' },
  pigmentation: { label: 'Brightening', icon: Sun, color: 'bg-amber-100 text-amber-700 border-amber-200' },
  aging: { label: 'Anti-Aging', icon: Clock, color: 'bg-rose-100 text-rose-700 border-rose-200' },
  dryness: { label: 'Hydrating', icon: Droplets, color: 'bg-blue-100 text-blue-700 border-blue-200' },
};

export default function ProductCard({ product, showCompareCheckbox, isSelected, onSelectChange }: ProductCardProps) {
  const { data: favorites } = useGetFavorites();
  const { data: notes } = useGetProductNotes();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const [showNoteModal, setShowNoteModal] = useState(false);

  const isFavorite = favorites?.includes(product.name) || false;
  const productNote = notes?.find((note) => note.productName === product.name);

  const handleFavoriteToggle = async () => {
    if (isFavorite) {
      await removeFavorite.mutateAsync(product.name);
    } else {
      await addFavorite.mutateAsync(product.name);
    }
  };

  return (
    <>
      <Card className="border-2 border-border hover:shadow-xl hover:border-primary/30 transition-all duration-200 h-full flex flex-col rounded-2xl">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-1">
              <CardTitle className="text-xl font-semibold text-foreground leading-tight">{product.name}</CardTitle>
              <CardDescription className="text-muted-foreground font-medium">{product.brand}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {showCompareCheckbox && (
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => onSelectChange?.(checked as boolean)}
                  className="rounded-md"
                />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavoriteToggle}
                disabled={addFavorite.isPending || removeFavorite.isPending}
                className={`rounded-xl transition-all duration-200 ${isFavorite ? 'text-rose-500 hover:text-rose-600 hover:bg-rose-50' : 'text-muted-foreground hover:text-rose-500 hover:bg-rose-50'}`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
          <Badge variant="outline" className="border-2 border-primary/30 text-primary w-fit font-semibold rounded-lg px-3 py-1">
            {priceRangeLabels[product.priceRange]}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-5 flex-1 flex flex-col">
          <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>

          {product.concerns && product.concerns.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.concerns.map((concern, idx) => {
                const config = concernConfig[concern];
                if (!config) return null;
                const Icon = config.icon;
                return (
                  <Badge key={idx} variant="secondary" className={`${config.color} flex items-center gap-1.5 border font-medium rounded-lg px-3 py-1`}>
                    <Icon className="w-3.5 h-3.5" />
                    {config.label}
                  </Badge>
                );
              })}
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Key Ingredients</h4>
            <div className="flex flex-wrap gap-2">
              {product.keyIngredients.map((ingredient, idx) => (
                <Badge key={idx} variant="outline" className="text-xs border-2 border-border text-muted-foreground font-medium rounded-lg px-2.5 py-1">
                  {ingredient}
                </Badge>
              ))}
            </div>
          </div>

          {productNote && (
            <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Number(productNote.rating) ? 'fill-amber-500 text-amber-500' : 'text-amber-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-amber-800 line-clamp-2 leading-relaxed">{productNote.notes}</p>
            </div>
          )}

          <div className="mt-auto pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNoteModal(true)}
              className="w-full border-2 border-border text-foreground hover:bg-accent/50 font-semibold rounded-xl transition-all duration-200"
            >
              {productNote ? 'Edit Note' : 'Add Note'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showNoteModal && (
        <ProductNoteModal
          product={product}
          existingNote={productNote}
          onClose={() => setShowNoteModal(false)}
        />
      )}
    </>
  );
}
