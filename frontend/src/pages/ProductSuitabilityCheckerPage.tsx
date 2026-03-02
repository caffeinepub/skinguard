import { useState, useRef, useEffect } from 'react';
import { useSearch } from '@tanstack/react-router';
import { Loader2, Search, AlertCircle, CheckCircle, AlertTriangle, XCircle, Info, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import AuthGuard from '../components/AuthGuard';
import {
  useProductSuitabilityCheck,
  useProductAutocomplete,
  useGetLatestSkinType,
  useGetSkinTypeDetectionResults,
  useAnalyzeIngredients,
} from '../hooks/useQueries';
import { ProductSuitability, IngredientSafety, SkinType } from '../backend';
import { getSafetyLabel, computeCompatibilityScore, getVerdictFromScore } from '../utils/ingredientDatabase';

// Detect if input looks like an ingredient list (contains commas or known ingredient keywords)
function looksLikeIngredientList(input: string): boolean {
  const trimmed = input.trim();
  if (trimmed.includes(',')) return true;
  const ingredientKeywords = [
    'acid', 'alcohol', 'glycerin', 'water', 'aqua', 'sodium', 'extract',
    'oil', 'butter', 'oxide', 'retinol', 'niacinamide', 'ceramide', 'peptide',
    'hyaluronic', 'salicylic', 'glycolic', 'vitamin', 'paraben', 'sulfate',
  ];
  const lower = trimmed.toLowerCase();
  return ingredientKeywords.some((kw) => lower.includes(kw));
}

function ProductSuitabilityCheckerContent() {
  const searchParams = useSearch({ from: '/product-checker' }) as { product?: string };
  const [input, setInput] = useState('');
  const [validationError, setValidationError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: checkSuitability, data: suitabilityResult, isPending: suitabilityPending, error: suitabilityError } = useProductSuitabilityCheck();
  const analyzeIngredientsMutation = useAnalyzeIngredients();
  const { suggestions, isLoading: suggestionsLoading } = useProductAutocomplete(input);
  const { data: latestSkinType } = useGetLatestSkinType();
  const { data: allResults } = useGetSkinTypeDetectionResults();

  const isPending = suitabilityPending || analyzeIngredientsMutation.isPending;
  const error = suitabilityError || analyzeIngredientsMutation.error;

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

    // If input looks like an ingredient list, use ingredient analysis
    if (looksLikeIngredientList(trimmedInput)) {
      const ingredientNames = trimmedInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      analyzeIngredientsMutation.mutate({ ingredientNames, skinType: latestSkinType });
    } else {
      checkSuitability({
        productNameOrIngredients: trimmedInput,
        userSkinType: latestSkinType,
        concerns: latestResult.concerns,
      });
    }
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
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
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
    const label = getSafetyLabel(classification);
    switch (classification) {
      case IngredientSafety.safe:
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-100 border">{label}</Badge>;
      case IngredientSafety.conditional:
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-100 border">{label}</Badge>;
      case IngredientSafety.risky:
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-100 border">{label}</Badge>;
      case IngredientSafety.harmful:
        return <Badge className="bg-red-100 text-red-800 border-red-300 hover:bg-red-100 border">{label}</Badge>;
    }
  };

  const getSafetyIcon = (classification: IngredientSafety) => {
    switch (classification) {
      case IngredientSafety.safe:
        return <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />;
      case IngredientSafety.conditional:
        return <Info className="w-4 h-4 text-blue-600 shrink-0" />;
      case IngredientSafety.risky:
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
      case IngredientSafety.harmful:
        return <XCircle className="w-4 h-4 text-red-600 shrink-0" />;
    }
  };

  const calculateCompatibilityScore = () => {
    if (!suitabilityResult) return 0;
    switch (suitabilityResult.suitability) {
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

  const config = suitabilityResult ? getSuitabilityConfig(suitabilityResult.suitability) : null;
  const compatibilityScore = calculateCompatibilityScore();

  // Ingredient analysis results (when user entered ingredient list)
  const ingredientResults = analyzeIngredientsMutation.data?.results ?? [];
  const ingredientScore = analyzeIngredientsMutation.data?.score;
  const showIngredientAnalysis = analyzeIngredientsMutation.isSuccess && ingredientResults.length > 0;

  const numericIngredientScore = ingredientScore ? Number(ingredientScore.score) : 0;
  const ingredientVerdict = ingredientScore ? getVerdictFromScore(numericIngredientScore) : '';

  const getScoreGradient = (score: number) => {
    if (score >= 75) return 'from-emerald-500 to-teal-500';
    if (score >= 50) return 'from-yellow-500 to-orange-400';
    return 'from-red-500 to-rose-500';
  };

  const getCardBorderColor = (classification: IngredientSafety) => {
    switch (classification) {
      case IngredientSafety.safe: return 'border-emerald-200 bg-emerald-50/40';
      case IngredientSafety.conditional: return 'border-blue-200 bg-blue-50/40';
      case IngredientSafety.risky: return 'border-amber-200 bg-amber-50/40';
      case IngredientSafety.harmful: return 'border-red-200 bg-red-50/40';
      default: return 'border-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-emerald-900">Product Suitability Checker</h1>
          <p className="text-lg text-emerald-700 max-w-2xl mx-auto">
            Enter a product name or paste an ingredient list to check compatibility with your skin type
          </p>
        </div>

        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-900">Enter Product Name or Ingredients</CardTitle>
            <CardDescription>
              Type a product name for a quick check, or paste a full ingredient list (comma-separated) for detailed analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Textarea
                ref={inputRef}
                placeholder="CeraVe Hydrating Cleanser  —or—  Water, Glycerin, Alcohol, Sodium Lauryl Sulfate, Hyaluronic Acid..."
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

        {/* Ingredient List Analysis Results */}
        {showIngredientAnalysis && ingredientScore && (
          <div className="space-y-6">
            {/* Score Card */}
            <Card className="border-emerald-200 overflow-hidden">
              <div className={`bg-gradient-to-r ${getScoreGradient(numericIngredientScore)} p-6`}>
                <div className="text-center text-white space-y-1">
                  <p className="text-sm font-medium uppercase tracking-widest opacity-90">Compatibility Rate</p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-7xl font-bold">{numericIngredientScore}</div>
                    <div className="text-left">
                      <div className="text-3xl font-semibold">{ingredientVerdict}</div>
                      <div className="text-sm opacity-90">out of 100</div>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="pt-4 pb-4">
                <div className="mb-2 text-xs text-gray-500 flex justify-between">
                  <span>0 — Unsafe</span>
                  <span>100 — Excellent</span>
                </div>
                <Progress value={numericIngredientScore} className="h-3" />
              </CardContent>
            </Card>

            {/* Ingredient Breakdown */}
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-emerald-900">Ingredient Breakdown</CardTitle>
                <CardDescription>
                  {ingredientResults.length} ingredient{ingredientResults.length !== 1 ? 's' : ''} analyzed — sorted by safety concern
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...ingredientResults]
                    .sort((a, b) => {
                      const order = {
                        [IngredientSafety.harmful]: 0,
                        [IngredientSafety.risky]: 1,
                        [IngredientSafety.conditional]: 2,
                        [IngredientSafety.safe]: 3,
                      };
                      return (order[a.safetyClassification] ?? 4) - (order[b.safetyClassification] ?? 4);
                    })
                    .map((result, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border-2 ${getCardBorderColor(result.safetyClassification)}`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {getSafetyIcon(result.safetyClassification)}
                            <h3 className="font-semibold text-base text-gray-900 truncate">
                              {result.ingredientName}
                            </h3>
                          </div>
                          {getIngredientSafetyBadge(result.safetyClassification)}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed mb-2">{result.explanation}</p>
                        <div className="flex flex-wrap gap-2">
                          {result.isCompatible ? (
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Compatible with your skin type
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300 text-xs">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Not ideal for your skin type
                            </Badge>
                          )}
                          {result.concernWarnings && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300 text-xs">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              May cause skin concerns
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Product Name Suitability Results */}
        {suitabilityResult && config && !showIngredientAnalysis && (
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

            {suitabilityResult.explanation && (
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-900">Detailed Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {suitabilityResult.explanation.highlightedIngredients.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Key Ingredients</h3>
                      <div className="space-y-3">
                        {suitabilityResult.explanation.highlightedIngredients.map((ingredient, index) => (
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

                  {suitabilityResult.explanation.scientificReasoning && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Scientific Reasoning</h3>
                      <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
                        {suitabilityResult.explanation.scientificReasoning}
                      </div>
                    </div>
                  )}

                  {suitabilityResult.explanation.suggestedAlternatives.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Suggested Alternatives</h3>
                      <ul className="space-y-2">
                        {suitabilityResult.explanation.suggestedAlternatives.map((alt, index) => (
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
