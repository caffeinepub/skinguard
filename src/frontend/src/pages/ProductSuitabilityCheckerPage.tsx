import { useState, useRef, useEffect } from 'react';
import { useSearch } from '@tanstack/react-router';
import { Loader2, Search, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';
import AuthGuard from '../components/AuthGuard';
import { useProductSuitabilityCheck, useProductAutocomplete, useGetLatestSkinType, useGetSkinTypeDetectionResults } from '../hooks/useQueries';
import { ProductSuitability, IngredientSafety } from '../backend';

function ProductSuitabilityCheckerContent() {
  const searchParams = useSearch({ from: '/product-checker' }) as { product?: string };
  const [input, setInput] = useState('');
  const [validationError, setValidationError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const { mutate: checkSuitability, data: result, isPending, error } = useProductSuitabilityCheck();
  const { suggestions, isLoading: suggestionsLoading } = useProductAutocomplete(input);
  const { data: latestSkinType } = useGetLatestSkinType();
  const { data: allResults } = useGetSkinTypeDetectionResults();

  // Pre-fill product name from URL search params
  useEffect(() => {
    if (searchParams?.product) {
      setInput(searchParams.product);
    }
  }, [searchParams]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show dropdown when there are suggestions
  useEffect(() => {
    if (suggestions.length > 0 && input.trim()) {
      setShowDropdown(true);
      setSelectedIndex(-1);
    } else {
      setShowDropdown(false);
    }
  }, [suggestions, input]);

  const handleAnalyze = () => {
    const trimmedInput = input.trim();
    
    if (!trimmedInput) {
      setValidationError('Please enter a product name or ingredient list');
      return;
    }

    if (!latestSkinType || !allResults || allResults.length === 0) {
      setValidationError('Please complete the skin type questionnaire first');
      return;
    }

    const latestResult = allResults[0];

    setValidationError('');
    setShowDropdown(false);
    checkSuitability({ 
      productNameOrIngredients: trimmedInput, 
      userSkinType: latestSkinType,
      concerns: latestResult.concerns
    });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleAnalyze();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleAnalyze();
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const getSuitabilityConfig = (suitability: ProductSuitability) => {
    switch (suitability) {
      case ProductSuitability.suitable:
        return {
          icon: CheckCircle,
          label: '✅ Suitable for Your Skin',
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
        };
      case ProductSuitability.caution:
        return {
          icon: AlertTriangle,
          label: '⚠️ Use With Caution',
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
        };
      case ProductSuitability.not_recommended:
        return {
          icon: AlertCircle,
          label: '❌ Not Recommended',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        };
    }
  };

  const getIngredientSafetyBadge = (classification: IngredientSafety) => {
    switch (classification) {
      case IngredientSafety.safe:
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Safe</Badge>;
      case IngredientSafety.conditional:
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Conditional</Badge>;
      case IngredientSafety.risky:
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Risky</Badge>;
      case IngredientSafety.harmful:
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Harmful</Badge>;
    }
  };

  const calculateCompatibilityScore = () => {
    if (!result) return 0;
    
    const { suitability } = result;
    
    switch (suitability) {
      case ProductSuitability.suitable:
        return 90;
      case ProductSuitability.caution:
        return 60;
      case ProductSuitability.not_recommended:
        return 30;
      default:
        return 0;
    }
  };

  const config = result ? getSuitabilityConfig(result.suitability) : null;
  const compatibilityScore = calculateCompatibilityScore();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-emerald-900">Product Suitability Checker</h1>
          <p className="text-lg text-emerald-700 max-w-2xl mx-auto">
            Check if a product is suitable for your skin type and concerns
          </p>
        </div>

        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-900">Enter Product Name or Ingredients</CardTitle>
            <CardDescription>
              Type a product name or paste the ingredient list
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Textarea
                ref={inputRef}
                placeholder="CeraVe Hydrating Facial Cleanser or Water, Glycerin, Ceramides..."
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (validationError) {
                    setValidationError('');
                  }
                }}
                onKeyDown={handleKeyDown}
                rows={4}
                className="resize-none border-emerald-200 focus:border-emerald-400"
              />
              {showDropdown && suggestions.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute z-10 w-full mt-1 bg-white border border-emerald-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 cursor-pointer hover:bg-emerald-50 ${
                        index === selectedIndex ? 'bg-emerald-50' : ''
                      }`}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {validationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}
            <Button
              onClick={handleAnalyze}
              disabled={!input.trim() || isPending}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              size="lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Check Suitability
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error?.message || 'Failed to check product suitability. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        {result && config && (
          <div className="space-y-6">
            <Card className={`border-2 ${config.borderColor} ${config.bgColor}`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <config.icon className={`w-8 h-8 ${config.color}`} />
                  <CardTitle className={`text-2xl ${config.color}`}>{config.label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Compatibility Score</span>
                    <span className={`text-2xl font-bold ${config.color}`}>{compatibilityScore}%</span>
                  </div>
                  <Progress value={compatibilityScore} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {result.explanation && (
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-900">Detailed Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {result.explanation.highlightedIngredients.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Key Ingredients</h3>
                      <div className="space-y-3">
                        {result.explanation.highlightedIngredients.map((ingredient, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-900">{ingredient.name}</span>
                                {getIngredientSafetyBadge(ingredient.classification)}
                              </div>
                              <p className="text-sm text-gray-600">{ingredient.reason}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.explanation.scientificReasoning && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Scientific Reasoning</h3>
                      <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
                        {result.explanation.scientificReasoning}
                      </div>
                    </div>
                  )}

                  {result.explanation.suggestedAlternatives.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Suggested Alternatives</h3>
                      <ul className="space-y-2">
                        {result.explanation.suggestedAlternatives.map((alt, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700">
                            <span className="text-emerald-500 mt-1">•</span>
                            <span>{alt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductSuitabilityCheckerPage() {
  return (
    <AuthGuard>
      <ProductSuitabilityCheckerContent />
    </AuthGuard>
  );
}
