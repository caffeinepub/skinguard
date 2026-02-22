import { SkincareProduct, ProductCategory } from '../backend';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

interface ProductRecommendationsProps {
  products: SkincareProduct[];
}

const categoryLabels: Record<ProductCategory, string> = {
  [ProductCategory.cleanser]: 'Cleansers',
  [ProductCategory.moisturizer]: 'Moisturizers',
  [ProductCategory.serum]: 'Serums',
  [ProductCategory.sunscreen]: 'Sunscreens',
  [ProductCategory.treatment]: 'Treatments',
};

export default function ProductRecommendations({ products }: ProductRecommendationsProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const navigate = useNavigate();

  if (products.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-emerald-900 mb-2">
              Curating Your Recommendations
            </h3>
            <p className="text-emerald-700 max-w-md mx-auto">
              We're curating personalized product recommendations for your skin type. Check back soon!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const productsByCategory = products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<ProductCategory, SkincareProduct[]>);

  const categoryOrder: ProductCategory[] = [
    ProductCategory.cleanser,
    ProductCategory.serum,
    ProductCategory.moisturizer,
    ProductCategory.sunscreen,
    ProductCategory.treatment,
  ];

  const handleSelectChange = (productName: string, selected: boolean) => {
    if (selected) {
      if (selectedProducts.length < 3) {
        setSelectedProducts([...selectedProducts, productName]);
      }
    } else {
      setSelectedProducts(selectedProducts.filter((p) => p !== productName));
    }
  };

  const handleCompare = () => {
    const params = new URLSearchParams();
    selectedProducts.forEach((p) => params.append('product', p));
    navigate({ to: '/compare', search: params as any });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
          Personalized for You
        </Badge>
        <h2 className="text-3xl font-bold text-emerald-900 mb-2">Product Recommendations</h2>
        <p className="text-emerald-600">Curated products for your skin type and concerns</p>
      </div>

      {selectedProducts.length >= 2 && (
        <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
          <p className="text-emerald-700">
            <strong>{selectedProducts.length}</strong> products selected for comparison
          </p>
          <Button
            onClick={handleCompare}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          >
            Compare Products
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      <div className="space-y-8">
        {categoryOrder.map((category) => {
          const categoryProducts = productsByCategory[category];
          if (!categoryProducts || categoryProducts.length === 0) return null;

          return (
            <div key={category}>
              <h3 className="text-2xl font-semibold text-emerald-900 mb-4">
                {categoryLabels[category]}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryProducts.map((product, index) => (
                  <ProductCard
                    key={index}
                    product={product}
                    showCompareCheckbox
                    isSelected={selectedProducts.includes(product.name)}
                    onSelectChange={(selected) => handleSelectChange(product.name, selected)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
