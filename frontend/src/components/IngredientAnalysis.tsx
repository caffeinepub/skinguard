import { useState } from 'react';
import { useAnalyzeIngredients, useGetLatestSkinType } from '../hooks/useQueries';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Loader2, AlertCircle, CheckCircle, AlertTriangle, XCircle, Sparkles, Info } from 'lucide-react';
import { IngredientSafety, Variant_fair_good_poor_unsafe_excellent } from '../backend';
import { getSafetyLabel } from '../utils/ingredientDatabase';

export default function IngredientAnalysis() {
  const [ingredientInput, setIngredientInput] = useState('');
  const [validationError, setValidationError] = useState('');
  const analyzeIngredients = useAnalyzeIngredients();
  const { data: latestSkinType } = useGetLatestSkinType();

  const parseIngredients = (input: string): string[] => {
    return input
      .split(',')
      .map((ingredient) => ingredient.trim())
      .filter((ingredient) => ingredient.length > 0);
  };

  const validateInput = (input: string): boolean => {
    if (!input.trim()) {
      setValidationError('Please enter at least one ingredient');
      return false;
    }

    const ingredients = parseIngredients(input);
    if (ingredients.length === 0) {
      setValidationError('Please enter valid ingredients separated by commas');
      return false;
    }

    setValidationError('');
    return true;
  };

  const handleAnalyze = () => {
    if (!validateInput(ingredientInput)) {
      return;
    }

    if (!latestSkinType) {
      setValidationError('Please complete the skin type questionnaire first');
      return;
    }

    const ingredients = parseIngredients(ingredientInput);
    analyzeIngredients.mutate({ ingredientNames: ingredients, skinType: latestSkinType });
  };

  const getSafetyBadgeStyle = (classification: IngredientSafety) => {
    switch (classification) {
      case IngredientSafety.safe:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-100';
      case IngredientSafety.conditional:
        return 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-100';
      case IngredientSafety.risky:
        return 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-100';
      case IngredientSafety.harmful:
        return 'bg-red-100 text-red-800 border-red-300 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSafetyIcon = (classification: IngredientSafety) => {
    switch (classification) {
      case IngredientSafety.safe:
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case IngredientSafety.conditional:
        return <Info className="w-4 h-4 text-blue-600" />;
      case IngredientSafety.risky:
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case IngredientSafety.harmful:
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getCardBorderColor = (classification: IngredientSafety) => {
    switch (classification) {
      case IngredientSafety.safe:
        return 'border-emerald-200 bg-emerald-50/40';
      case IngredientSafety.conditional:
        return 'border-blue-200 bg-blue-50/40';
      case IngredientSafety.risky:
        return 'border-amber-200 bg-amber-50/40';
      case IngredientSafety.harmful:
        return 'border-red-200 bg-red-50/40';
      default:
        return 'border-gray-200';
    }
  };

  const getScoreGradient = (score: bigint) => {
    const numScore = Number(score);
    if (numScore >= 75) return 'from-emerald-500 to-teal-500';
    if (numScore >= 50) return 'from-yellow-500 to-orange-400';
    return 'from-red-500 to-rose-500';
  };

  const getVerdictText = (verdict: Variant_fair_good_poor_unsafe_excellent) => {
    switch (verdict) {
      case Variant_fair_good_poor_unsafe_excellent.excellent:
        return 'Excellent';
      case Variant_fair_good_poor_unsafe_excellent.good:
        return 'Good';
      case Variant_fair_good_poor_unsafe_excellent.fair:
        return 'Fair';
      case Variant_fair_good_poor_unsafe_excellent.poor:
        return 'Poor';
      case Variant_fair_good_poor_unsafe_excellent.unsafe:
        return 'Unsafe';
      default:
        return 'Unknown';
    }
  };

  const getVerdictDescription = (verdict: Variant_fair_good_poor_unsafe_excellent) => {
    switch (verdict) {
      case Variant_fair_good_poor_unsafe_excellent.excellent:
        return 'This product is highly compatible with your skin type.';
      case Variant_fair_good_poor_unsafe_excellent.good:
        return 'This product is generally suitable for your skin type.';
      case Variant_fair_good_poor_unsafe_excellent.fair:
        return 'This product may work but has some ingredients to watch.';
      case Variant_fair_good_poor_unsafe_excellent.poor:
        return 'This product has several ingredients that may not suit your skin.';
      case Variant_fair_good_poor_unsafe_excellent.unsafe:
        return 'This product contains multiple harmful ingredients. Avoid use.';
      default:
        return '';
    }
  };

  const isInputValid = ingredientInput.trim().length > 0 && !validationError;

  const results = analyzeIngredients.data?.results ?? [];
  const score = analyzeIngredients.data?.score;

  const harmfulCount = results.filter((r) => r.safetyClassification === IngredientSafety.harmful).length;
  const riskyCount = results.filter((r) => r.safetyClassification === IngredientSafety.risky).length;
  const safeCount = results.filter((r) => r.safetyClassification === IngredientSafety.safe).length;
  const conditionalCount = results.filter((r) => r.safetyClassification === IngredientSafety.conditional).length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-emerald-900">Ingredient Analysis</h1>
          <p className="text-lg text-emerald-700 max-w-2xl mx-auto">
            Paste your product's ingredient list to get a comprehensive safety analysis and compatibility score for
            your skin type
          </p>
        </div>

        {/* Input Section */}
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-900">Enter Ingredients</CardTitle>
            <CardDescription>
              Copy and paste the ingredient list from your product label, separated by commas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g. Water, Glycerin, Niacinamide, Hyaluronic Acid, Alcohol, Sodium Lauryl Sulfate, Retinol..."
              value={ingredientInput}
              onChange={(e) => {
                setIngredientInput(e.target.value);
                if (validationError) {
                  setValidationError('');
                }
              }}
              rows={6}
              className="resize-none border-emerald-200 focus:border-emerald-400"
            />
            {validationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}
            <Button
              onClick={handleAnalyze}
              disabled={!isInputValid || analyzeIngredients.isPending}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              size="lg"
            >
              {analyzeIngredients.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyze Ingredients
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Error Display */}
        {analyzeIngredients.isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {analyzeIngredients.error?.message || 'Failed to analyze ingredients. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Results Display */}
        {analyzeIngredients.isSuccess && score && (
          <div className="space-y-6">
            {/* Compatibility Score Card */}
            <Card className="border-emerald-200 overflow-hidden">
              <div className={`bg-gradient-to-r ${getScoreGradient(score.score)} p-6`}>
                <div className="text-center text-white space-y-2">
                  <p className="text-sm font-medium uppercase tracking-widest opacity-90">
                    Compatibility Rate
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-7xl font-bold">{Number(score.score)}</div>
                    <div className="text-left">
                      <div className="text-3xl font-semibold">
                        {getVerdictText(score.verdict)}
                      </div>
                      <div className="text-sm opacity-90">out of 100</div>
                    </div>
                  </div>
                  <p className="text-sm opacity-90 mt-1">{getVerdictDescription(score.verdict)}</p>
                </div>
              </div>
              <CardContent className="pt-5 pb-5">
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>0 — Unsafe</span>
                    <span>100 — Excellent</span>
                  </div>
                  <Progress value={Number(score.score)} className="h-3" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center mt-4">
                  <div className="rounded-lg bg-red-50 border border-red-100 p-2">
                    <div className="text-2xl font-bold text-red-600">{harmfulCount}</div>
                    <div className="text-xs text-red-700 font-medium">Bad for Skin</div>
                  </div>
                  <div className="rounded-lg bg-amber-50 border border-amber-100 p-2">
                    <div className="text-2xl font-bold text-amber-600">{riskyCount}</div>
                    <div className="text-xs text-amber-700 font-medium">Caution</div>
                  </div>
                  <div className="rounded-lg bg-blue-50 border border-blue-100 p-2">
                    <div className="text-2xl font-bold text-blue-600">{conditionalCount}</div>
                    <div className="text-xs text-blue-700 font-medium">Use with Care</div>
                  </div>
                  <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-2">
                    <div className="text-2xl font-bold text-emerald-600">{safeCount}</div>
                    <div className="text-xs text-emerald-700 font-medium">Good for Skin</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ingredient Details */}
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-emerald-900">Ingredient Breakdown</CardTitle>
                <CardDescription>
                  {results.length} ingredient{results.length !== 1 ? 's' : ''} analyzed — sorted by safety concern
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Sort: harmful first, then risky, conditional, safe */}
                  {[...results]
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
                          <Badge className={`shrink-0 border font-semibold text-xs px-2.5 py-1 ${getSafetyBadgeStyle(result.safetyClassification)}`}>
                            {getSafetyLabel(result.safetyClassification)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed mb-3">{result.explanation}</p>
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

            {/* Legend */}
            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Safety Classification Guide</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Good for Skin', desc: 'Safe & beneficial', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                    { label: 'Use with Care', desc: 'Depends on skin type', color: 'text-blue-700 bg-blue-50 border-blue-200' },
                    { label: 'Caution', desc: 'May cause irritation', color: 'text-amber-700 bg-amber-50 border-amber-200' },
                    { label: 'Bad for Skin', desc: 'Harmful / Avoid', color: 'text-red-700 bg-red-50 border-red-200' },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-lg border p-2 text-center ${item.color}`}>
                      <div className="font-semibold text-xs">{item.label}</div>
                      <div className="text-xs opacity-80 mt-0.5">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
