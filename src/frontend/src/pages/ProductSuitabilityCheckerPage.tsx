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
import { useProductSuitabilityCheck, useProductAutocomplete } from '../hooks/useQueries';
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

    setValidationError('');
    setShowDropdown(false);
    checkSuitability(trimmedInput);
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

  const formatScientificReasoning = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('Scientific Reasoning (INCI AI):')) {
        return (
          <div key={index} className="font-bold text-emerald-900 text-lg mb-3">
            {trimmedLine.replace('Scientific Reasoning (INCI AI):', '').trim()}
          </div>
        );
      }
      
      if (trimmedLine.startsWith('Product Ingredients:')) {
        return (
          <div key={index} className="mb-3">
            <span className="font-semibold text-emerald-800">Product Ingredients:</span>
            <span className="text-emerald-700">{trimmedLine.replace('Product Ingredients:', '')}</span>
          </div>
        );
      }
      
      if (trimmedLine.match(/^(Oily|Dry|Combination|Sensitive|Normal) Skin:/)) {
        return (
          <div key={index} className="font-semibold text-emerald-800 mt-4 mb-2">
            {trimmedLine}
          </div>
        );
      }
      
      if (trimmedLine.startsWith('- Suitable Ingredients:') || trimmedLine.startsWith('- Cautionary Ingredients:')) {
        return (
          <div key={index} className="font-semibold text-emerald-800 mt-3 mb-1">
            {trimmedLine}
          </div>
        );
      }
      
      if (trimmedLine.startsWith('*')) {
        return (
          <div key={index} className="ml-6 text-emerald-700 mb-1">
            {trimmedLine}
          </div>
        );
      }
      
      if (trimmedLine) {
        return (
          <div key={index} className="text-emerald-700 mb-2">
            {trimmedLine}
          </div>
        );
      }
      
      return <div key={index} className="h-2" />;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-900 mb-3">Product Suitability Checker</h1>
          <p className="text-lg text-emerald-700">
            Verify if a product is safe and compatible with your skin type
          </p>
        </div>

        <Card className="mb-8 border-emerald-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-emerald-900">Enter Product Information</CardTitle>
            <CardDescription>
              Start typing a product name to see suggestions, or paste a comma-separated list of ingredients
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Textarea
                ref={inputRef}
                placeholder="Example: CeraVe Hydrating Cleanser&#10;&#10;Or ingredients: Water, Glycerin, Niacinamide, Ceramides, Hyaluronic Acid..."
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setValidationError('');
                }}
                onKeyDown={handleKeyDown}
                className="min-h-[120px] resize-none border-emerald-200 focus:border-emerald-400"
              />
              
              {/* Autocomplete Dropdown */}
              {showDropdown && suggestions.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute z-10 w-full mt-1 bg-white border border-emerald-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors border-b border-emerald-100 last:border-b-0 ${
                        index === selectedIndex ? 'bg-emerald-100' : ''
                      }`}
                    >
                      <span className="text-emerald-900 font-medium">{suggestion}</span>
                    </button>
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

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={isPending}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
              size="lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Check Suitability
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6">
            {/* Suitability Classification */}
            <Card className={`border-2 ${getSuitabilityConfig(result.suitability).borderColor} ${getSuitabilityConfig(result.suitability).bgColor}`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = getSuitabilityConfig(result.suitability).icon;
                    return <Icon className={`w-8 h-8 ${getSuitabilityConfig(result.suitability).color}`} />;
                  })()}
                  <CardTitle className={`text-2xl ${getSuitabilityConfig(result.suitability).color}`}>
                    {getSuitabilityConfig(result.suitability).label}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-emerald-900">Compatibility Score</span>
                      <span className="text-sm font-bold text-emerald-900">{calculateCompatibilityScore()}%</span>
                    </div>
                    <Progress value={calculateCompatibilityScore()} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Explanation Panel */}
            <Card className="border-emerald-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-emerald-900">Detailed Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Highlighted Ingredients */}
                {result.explanation.highlightedIngredients.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-900 mb-3">Key Ingredients</h3>
                    <div className="space-y-3">
                      {result.explanation.highlightedIngredients.map((ingredient, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-emerald-900">{ingredient.name}</span>
                              {getIngredientSafetyBadge(ingredient.classification)}
                            </div>
                            <p className="text-sm text-emerald-700">{ingredient.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Scientific Reasoning */}
                {result.explanation.scientificReasoning && (
                  <>
                    <Separator className="bg-emerald-200" />
                    <div>
                      <h3 className="text-lg font-semibold text-emerald-900 mb-3">Scientific Reasoning (INCI AI)</h3>
                      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                          {formatScientificReasoning(result.explanation.scientificReasoning)}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Suggested Alternatives */}
                {result.explanation.suggestedAlternatives.length > 0 && (
                  <>
                    <Separator className="bg-emerald-200" />
                    <div>
                      <h3 className="text-lg font-semibold text-emerald-900 mb-3">Suggested Alternatives</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {result.explanation.suggestedAlternatives.map((alternative, index) => (
                          <div key={index} className="p-3 bg-white rounded-lg border border-emerald-200 hover:border-emerald-400 transition-colors">
                            <span className="text-emerald-900 font-medium">{alternative}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
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
