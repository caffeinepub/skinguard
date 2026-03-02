import { SkincareProduct, IngredientAnalysisResult, PriceRange } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface ComparisonTableProps {
  products: SkincareProduct[];
  analysis: IngredientAnalysisResult[];
}

const priceRangeLabels: Record<PriceRange, string> = {
  [PriceRange.low]: '$0-$20',
  [PriceRange.medium]: '$20-$50',
  [PriceRange.high]: '$50+',
};

export default function ComparisonTable({ products, analysis }: ComparisonTableProps) {
  const getIngredientCompatibility = (ingredientName: string) => {
    const result = analysis.find((a) => a.ingredientName === ingredientName);
    return result?.isCompatible;
  };

  const allIngredients = Array.from(
    new Set(products.flatMap((p) => p.keyIngredients))
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <Card key={index} className="border-emerald-200">
            <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardTitle className="text-emerald-900">{product.name}</CardTitle>
              <p className="text-sm text-emerald-600">{product.brand}</p>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="text-sm font-semibold text-emerald-900 mb-1">Price Range</p>
                <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                  {priceRangeLabels[product.priceRange]}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-semibold text-emerald-900 mb-2">Key Ingredients</p>
                <div className="space-y-1">
                  {product.keyIngredients.map((ingredient, idx) => {
                    const isCompatible = getIngredientCompatibility(ingredient);
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        {isCompatible === true ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : isCompatible === false ? (
                          <XCircle className="w-4 h-4 text-red-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm text-emerald-700">{ingredient}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-emerald-900 mb-2">Targets</p>
                <div className="flex flex-wrap gap-1">
                  {product.concerns.map((concern, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">
                      {concern}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="text-emerald-900">Ingredient Compatibility</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {allIngredients.map((ingredient, index) => {
              const result = analysis.find((a) => a.ingredientName === ingredient);
              const productsWithIngredient = products.filter((p) =>
                p.keyIngredients.includes(ingredient)
              );

              return (
                <div key={index} className="p-3 rounded-lg border border-emerald-100">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-emerald-900">{ingredient}</span>
                        {result?.isCompatible ? (
                          <Badge className="bg-green-100 text-green-700">Compatible</Badge>
                        ) : result?.isCompatible === false ? (
                          <Badge className="bg-red-100 text-red-700">Not Compatible</Badge>
                        ) : null}
                      </div>
                      <p className="text-sm text-emerald-600">
                        Found in: {productsWithIngredient.map((p) => p.name).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
