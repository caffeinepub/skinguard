import AuthGuard from '../components/AuthGuard';
import { useState } from 'react';
import { useGetAllIngredients } from '../hooks/useQueries';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Loader2, Search, FlaskConical } from 'lucide-react';
import IngredientCard from '../components/IngredientCard';

export default function IngredientDictionaryPage() {
  return (
    <AuthGuard>
      <IngredientDictionaryContent />
    </AuthGuard>
  );
}

function IngredientDictionaryContent() {
  const { data: ingredients, isLoading } = useGetAllIngredients();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIngredients = ingredients?.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mx-auto" />
          <p className="text-emerald-700">Loading ingredient database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center mx-auto mb-4">
          <FlaskConical className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-emerald-900 mb-2">Ingredient Dictionary</h1>
        <p className="text-emerald-600">Explore our comprehensive ingredient database</p>
      </div>

      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
          <Input
            type="text"
            placeholder="Search ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-emerald-200 focus:border-emerald-400"
          />
        </div>
      </div>

      {!filteredIngredients || filteredIngredients.length === 0 ? (
        <Card className="border-emerald-200">
          <CardContent className="pt-12 pb-12 text-center">
            <FlaskConical className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-emerald-900 mb-2">No Ingredients Found</h3>
            <p className="text-emerald-600">
              {searchQuery ? 'Try a different search term' : 'The ingredient database is empty'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIngredients.map((ingredient, index) => (
            <IngredientCard key={index} ingredient={ingredient} />
          ))}
        </div>
      )}
    </div>
  );
}
