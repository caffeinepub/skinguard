import AuthGuard from '../components/AuthGuard';
import { useEffect, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCompareProducts } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Loader2, ArrowLeft } from 'lucide-react';
import ComparisonTable from '../components/ComparisonTable';

export default function ComparisonPage() {
  return (
    <AuthGuard>
      <ComparisonContent />
    </AuthGuard>
  );
}

function ComparisonContent() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as any;
  const [productNames, setProductNames] = useState<string[]>([]);
  const compareProducts = useCompareProducts();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const products = params.getAll('product');
    if (products.length >= 2 && products.length <= 3) {
      setProductNames(products);
      compareProducts.mutate(products);
    }
  }, []);

  if (productNames.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-semibold text-emerald-900 mb-4">No Products Selected</h2>
        <p className="text-emerald-600 mb-6">
          Please select 2-3 products from the recommendations page to compare.
        </p>
        <Button
          onClick={() => navigate({ to: '/results' })}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Button>
      </div>
    );
  }

  if (compareProducts.isPending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mx-auto" />
          <p className="text-emerald-700">Comparing products...</p>
        </div>
      </div>
    );
  }

  if (compareProducts.isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-semibold text-red-900 mb-4">Comparison Error</h2>
        <p className="text-red-600 mb-6">{compareProducts.error?.message || 'Failed to compare products'}</p>
        <Button
          onClick={() => navigate({ to: '/results' })}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/results' })}
          className="mb-4 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Button>
        <h1 className="text-4xl font-bold text-emerald-900 mb-2">Product Comparison</h1>
        <p className="text-emerald-600">Side-by-side analysis of your selected products</p>
      </div>

      {compareProducts.data && (
        <ComparisonTable
          products={compareProducts.data.products}
          analysis={compareProducts.data.analysis}
        />
      )}
    </div>
  );
}
