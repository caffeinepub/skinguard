import AuthGuard from '../components/AuthGuard';
import { useGetFavorites, useGetProductRecommendations, useGetLatestSkinType, useGetSkinTypeDetectionResults } from '../hooks/useQueries';
import { Card, CardContent } from '../components/ui/card';
import { Loader2, Heart } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function FavoritesPage() {
  return (
    <AuthGuard>
      <FavoritesContent />
    </AuthGuard>
  );
}

function FavoritesContent() {
  const { data: favorites, isLoading: loadingFavorites } = useGetFavorites();
  const { data: latestSkinType } = useGetLatestSkinType();
  const { data: allResults } = useGetSkinTypeDetectionResults();
  
  const latestResult = allResults && allResults.length > 0 ? allResults[0] : null;
  
  const { data: allProducts, isLoading: loadingProducts } = useGetProductRecommendations(
    latestSkinType || null,
    latestResult?.concerns || null
  );

  if (loadingFavorites || loadingProducts) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mx-auto" />
          <p className="text-emerald-700">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  const favoriteProducts = allProducts?.filter((product) => favorites?.includes(product.name)) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-white fill-white" />
        </div>
        <h1 className="text-4xl font-bold text-emerald-900 mb-2">My Favorites</h1>
        <p className="text-emerald-600">Products you've saved for later</p>
      </div>

      {favoriteProducts.length === 0 ? (
        <Card className="border-emerald-200">
          <CardContent className="pt-12 pb-12 text-center">
            <Heart className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-emerald-900 mb-2">No Favorites Yet</h3>
            <p className="text-emerald-600">
              Start adding products to your favorites by clicking the heart icon on product cards!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
