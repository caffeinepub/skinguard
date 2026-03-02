import { useGetLatestQuestionnaireResult, useGetQuestionnaireResults, useGetProductRecommendations } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Loader2, RefreshCw, Sparkles, AlertCircle, Droplets, Zap, Clock, Sun } from 'lucide-react';
import { skinTypeDescriptions } from '../utils/skinTypeDescriptions';
import { SkinType, ConcernLevel } from '../backend';
import ProductRecommendations from './ProductRecommendations';

const concernIcons = {
  acne: Zap,
  pigmentation: Sun,
  aging: Clock,
  dryness: Droplets,
};

const concernLabels = {
  acne: 'Acne',
  pigmentation: 'Pigmentation',
  aging: 'Aging',
  dryness: 'Dryness',
};

const concernLevelLabels = {
  [ConcernLevel.none]: 'None',
  [ConcernLevel.low]: 'Mild',
  [ConcernLevel.medium]: 'Moderate',
  [ConcernLevel.high]: 'Severe',
};

const concernLevelColors = {
  [ConcernLevel.none]: 'bg-gray-100 text-gray-700',
  [ConcernLevel.low]: 'bg-yellow-100 text-yellow-700',
  [ConcernLevel.medium]: 'bg-orange-100 text-orange-700',
  [ConcernLevel.high]: 'bg-red-100 text-red-700',
};

export default function ResultsDisplay() {
  const { data: latestResult, isLoading: loadingLatest } = useGetLatestQuestionnaireResult();
  const { data: allResults, isLoading: loadingAll } = useGetQuestionnaireResults();
  const navigate = useNavigate();

  const skinType = latestResult?.detectedSkinType ?? null;
  const concerns = latestResult?.concerns ?? null;

  const { data: products, isLoading: loadingProducts, error: productsError } = useGetProductRecommendations(
    skinType,
    concerns
  );

  if (loadingLatest || loadingAll) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!latestResult || !skinType) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="space-y-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center mx-auto">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground">No Results Yet</h2>
          <p className="text-muted-foreground">
            Take the questionnaire to discover your skin type and get personalized recommendations.
          </p>
          <Button
            onClick={() => navigate({ to: '/questionnaire' })}
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground"
          >
            Start Questionnaire
          </Button>
        </div>
      </div>
    );
  }

  const description = skinTypeDescriptions[skinType];
  const resultCount = allResults?.length || 0;

  // Filter concerns that are not 'none'
  const activeConcerns = Object.entries({
    acne: concerns!.acne,
    pigmentation: concerns!.pigmentation,
    aging: concerns!.aging,
    dryness: concerns!.dryness,
  }).filter(([_, level]) => level !== ConcernLevel.none);

  return (
    <div className="space-y-12 pb-12">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
            Analysis Complete
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-2">Your Skin Profile</h1>
          <p className="text-muted-foreground">Based on your questionnaire responses</p>
        </div>

        <Card className="border-border shadow-xl mb-8">
          <CardHeader className="text-center bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center mx-auto mb-4">
              <img
                src="/assets/generated/skin-types.dim_800x200.png"
                alt="Skin Types"
                className="w-16 h-16 object-contain"
              />
            </div>
            <CardTitle className="text-3xl text-foreground capitalize">{skinType} Skin</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">{description?.tagline}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {description && (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Characteristics</h3>
                  <p className="text-muted-foreground leading-relaxed">{description.characteristics}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Care Tips</h3>
                  <ul className="space-y-2">
                    {description.careTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Recommended Ingredients</h3>
                  <div className="flex flex-wrap gap-2">
                    {description.recommendedIngredients.map((ingredient, index) => (
                      <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Skin Concerns Section */}
        {activeConcerns.length > 0 && (
          <Card className="border-border shadow-xl mb-8">
            <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10">
              <CardTitle className="text-2xl text-foreground">Your Skin Concerns</CardTitle>
              <CardDescription className="text-muted-foreground">
                We've identified the following concerns to address
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeConcerns.map(([concern, level]) => {
                  const Icon = concernIcons[concern as keyof typeof concernIcons];
                  return (
                    <div
                      key={concern}
                      className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/70 to-primary flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">
                          {concernLabels[concern as keyof typeof concernLabels]}
                        </h4>
                        <Badge
                          className={`mt-1 ${concernLevelColors[level as ConcernLevel]}`}
                          variant="secondary"
                        >
                          {concernLevelLabels[level as ConcernLevel]}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate({ to: '/questionnaire' })}
            variant="outline"
            className="border-border text-foreground hover:bg-accent"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retake Questionnaire
          </Button>
        </div>

        {resultCount > 1 && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            You have completed {resultCount} skin type {resultCount === 1 ? 'analysis' : 'analyses'}
          </div>
        )}
      </div>

      {/* Product Recommendations Section */}
      <div className="border-t border-border pt-12">
        {loadingProducts ? (
          <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading product recommendations...</p>
          </div>
        ) : productsError ? (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="pt-6 text-center">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Unable to Load Recommendations
                </h3>
                <p className="text-muted-foreground">
                  We encountered an error loading product recommendations. Please try again later.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <ProductRecommendations products={products || []} />
        )}
      </div>
    </div>
  );
}
