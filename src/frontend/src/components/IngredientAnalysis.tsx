import { useState } from 'react';
import { useAnalyzeIngredients, useGetLatestSkinType } from '../hooks/useQueries';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, AlertCircle, CheckCircle, AlertTriangle, XCircle, Sparkles } from 'lucide-react';
import { IngredientSafety, Variant_fair_good_poor_unsafe_excellent, SkinType } from '../backend';

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

  const getSafetyBadgeVariant = (classification: IngredientSafety) => {
    switch (classification) {
      case IngredientSafety.safe:
        return 'default';
      case IngredientSafety.conditional:
        return 'secondary';
      case IngredientSafety.risky:
        return 'outline';
      case IngredientSafety.harmful:
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getSafetyIcon = (classification: IngredientSafety) => {
    switch (classification) {
      case IngredientSafety.safe:
        return <CheckCircle className="w-4 h-4" />;
      case IngredientSafety.conditional:
        return <AlertCircle className="w-4 h-4" />;
      case IngredientSafety.risky:
        return <AlertTriangle className="w-4 h-4" />;
      case IngredientSafety.harmful:
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getSafetyColor = (classification: IngredientSafety) => {
    switch (classification) {
      case IngredientSafety.safe:
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case IngredientSafety.conditional:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case IngredientSafety.risky:
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case IngredientSafety.harmful:
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return '';
    }
  };

  const getScoreColor = (score: bigint) => {
    const numScore = Number(score);
    if (numScore >= 71) return 'text-emerald-600';
    if (numScore >= 41) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: bigint) => {
    const numScore = Number(score);
    if (numScore >= 71) return 'from-emerald-500 to-teal-500';
    if (numScore >= 41) return 'from-yellow-500 to-orange-500';
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

  const isInputValid = ingredientInput.trim().length > 0 && !validationError;

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
              placeholder="Water, Glycerin, Niacinamide, Hyaluronic Acid, Ceramides, Vitamin C, Retinol, Salicylic Acid..."
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
        {analyzeIngredients.isSuccess && analyzeIngredients.data && (
          <div className="space-y-6">
            {/* Compatibility Score */}
            <Card className="border-emerald-200 overflow-hidden">
              <div className={`bg-gradient-to-r ${getScoreGradient(analyzeIngredients.data.score.score)} p-6`}>
                <div className="text-center text-white space-y-2">
                  <p className="text-sm font-medium uppercase tracking-wide opacity-90">
                    Product Compatibility Score
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-6xl font-bold">{Number(analyzeIngredients.data.score.score)}</div>
                    <div className="text-left">
                      <div className="text-2xl font-semibold">
                        {getVerdictText(analyzeIngredients.data.score.verdict)}
                      </div>
                      <div className="text-sm opacity-90">for your skin type</div>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  {[
                    { range: '90-100', label: 'Excellent', color: 'text-emerald-600' },
                    { range: '75-89', label: 'Good', color: 'text-teal-600' },
                    { range: '50-74', label: 'Fair', color: 'text-yellow-600' },
                    { range: '0-49', label: 'Poor/Unsafe', color: 'text-red-600' },
                  ].map((item) => (
                    <div key={item.range} className="space-y-1">
                      <div className={`font-semibold ${item.color}`}>{item.range}</div>
                      <div className="text-sm text-gray-600">{item.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ingredient Details */}
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="text-emerald-900">Ingredient Analysis Details</CardTitle>
                <CardDescription>
                  {analyzeIngredients.data.results.length} ingredient
                  {analyzeIngredients.data.results.length !== 1 ? 's' : ''} analyzed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyzeIngredients.data.results.map((result, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 ${getSafetyColor(result.safetyClassification)}`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900">{result.ingredientName}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          {getSafetyIcon(result.safetyClassification)}
                          <Badge variant={getSafetyBadgeVariant(result.safetyClassification)}>
                            {result.safetyClassification}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700">{result.explanation}</p>
                        <div className="flex flex-wrap gap-2">
                          {result.isCompatible ? (
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Compatible with your skin type
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Not ideal for your skin type
                            </Badge>
                          )}
                          {result.concernWarnings && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              May cause concerns
                            </Badge>
                          )}
                        </div>
                      </div>
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
