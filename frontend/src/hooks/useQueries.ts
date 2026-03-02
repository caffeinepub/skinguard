import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { 
  SkinType, 
  SkinTypeData,
  QuestionnaireResult,
  SkincareProduct, 
  IngredientAnalysisResult, 
  ProductCompatibilityScore, 
  SkinConcerns,
  SkincareRoutine,
  ProductNote,
  IngredientInfo,
  SuitabilityResult,
  User,
  IngredientSafety,
} from '../backend';
import { useMemo } from 'react';
import { lookupIngredient, computeCompatibilityScore, getVerdictFromScore } from '../utils/ingredientDatabase';

type ProgressMetrics = {
  acneTrend: string;
  pigmentationTrend: string;
  agingTrend: string;
  drynessTrend: string;
  stableSkinType: bigint;
};

export function useGetUserProfileIntro() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<User | null>({
    queryKey: ['userProfileIntro'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getUserProfileIntro();
      } catch (error: any) {
        if (error.message?.includes('User profile not found')) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useUpdateProfileIntro() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { name: string; age: number; email: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateUserProfileIntro(params.name, BigInt(params.age), params.email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfileIntro'] });
    },
  });
}

// Stub hooks for missing backend functionality
export function useGetCallerUserProfile() {
  return useGetUserProfileIntro();
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: { name: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateUserProfileIntro(profile.name, BigInt(25), null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfileIntro'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ---- Questionnaire / Skin Type Hooks ----

export function useGetQuestionnaireResults() {
  const { actor, isFetching } = useActor();

  return useQuery<SkinTypeData[]>({
    queryKey: ['questionnaireResults'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuestionnaireResults();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetLatestQuestionnaireResult() {
  const { actor, isFetching } = useActor();

  return useQuery<SkinTypeData | null>({
    queryKey: ['latestQuestionnaireResult'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLatestQuestionnaireResult();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveQuestionnaireResults() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (results: QuestionnaireResult) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveQuestionnaireResults(results);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['latestQuestionnaireResult'] });
      queryClient.invalidateQueries({ queryKey: ['questionnaireResults'] });
      queryClient.invalidateQueries({ queryKey: ['progressMetrics'] });
    },
  });
}

// Legacy aliases for backward compatibility
export function useGetSkinTypeDetectionResults() {
  return useGetQuestionnaireResults();
}

export function useGetLatestSkinType() {
  const { actor, isFetching } = useActor();

  return useQuery<SkinType | null>({
    queryKey: ['latestSkinType'],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getLatestQuestionnaireResult();
      return result ? result.detectedSkinType : null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveSkinTypeData() {
  return useSaveQuestionnaireResults();
}

export function useGetProgressMetrics() {
  const { actor, isFetching } = useActor();

  return useQuery<ProgressMetrics>({
    queryKey: ['progressMetrics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return {
        acneTrend: 'Stable',
        pigmentationTrend: 'Stable',
        agingTrend: 'Stable',
        drynessTrend: 'Stable',
        stableSkinType: BigInt(0),
      };
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProductRecommendations(skinType: SkinType | null, concerns: SkinConcerns | null) {
  const { actor, isFetching } = useActor();

  return useQuery<SkincareProduct[]>({
    queryKey: ['productRecommendations', skinType, concerns],
    queryFn: async () => {
      if (!actor || !skinType || !concerns) return [];
      return actor.getPersonalizedRecommendations(skinType, concerns);
    },
    enabled: !!actor && !isFetching && !!skinType && !!concerns,
  });
}

/**
 * Enrich backend analysis results with client-side ingredient database.
 * When the backend returns "No data found" (default safe), override with
 * the local database classification if available.
 */
function enrichAnalysisResults(
  backendResults: IngredientAnalysisResult[],
  skinType: SkinType
): IngredientAnalysisResult[] {
  return backendResults.map((result) => {
    const isDefaultResult =
      result.explanation === 'No data found. Default safe classification.' ||
      result.explanation === 'No data found. Default safe classification';

    if (isDefaultResult) {
      const localInfo = lookupIngredient(result.ingredientName);
      if (localInfo) {
        const isCompatible = localInfo.suitableSkinTypes.includes(skinType);
        return {
          ingredientName: localInfo.name,
          safetyClassification: localInfo.safetyClassification,
          isCompatible,
          concernWarnings:
            localInfo.isAcneProneConcern ||
            localInfo.isSensitiveConcern ||
            localInfo.isClogProneConcern,
          explanation: localInfo.description,
        };
      }
    }

    // Also check local DB for known ingredients even if backend found them
    // (backend may have outdated/incorrect classifications)
    const localInfo = lookupIngredient(result.ingredientName);
    if (localInfo) {
      const isCompatible = localInfo.suitableSkinTypes.includes(skinType);
      return {
        ingredientName: localInfo.name,
        safetyClassification: localInfo.safetyClassification,
        isCompatible,
        concernWarnings:
          localInfo.isAcneProneConcern ||
          localInfo.isSensitiveConcern ||
          localInfo.isClogProneConcern,
        explanation: localInfo.description,
      };
    }

    return result;
  });
}

export function useAnalyzeIngredients() {
  const { actor } = useActor();

  return useMutation<
    { results: IngredientAnalysisResult[]; score: ProductCompatibilityScore },
    Error,
    { ingredientNames: string[]; skinType: SkinType }
  >({
    mutationFn: async ({ ingredientNames, skinType }) => {
      if (!actor) throw new Error('Actor not available');

      const rawResults = await actor.analyzeIngredients(ingredientNames, skinType);

      // Enrich with client-side ingredient database for accurate classifications
      const enrichedResults = enrichAnalysisResults(rawResults, skinType);

      // Compute score from enriched results
      const numericScore = computeCompatibilityScore(enrichedResults);
      const verdictStr = getVerdictFromScore(numericScore);

      // Map verdict string to enum
      const verdictMap: Record<string, ProductCompatibilityScore['verdict']> = {
        'Excellent': 'excellent' as any,
        'Good': 'good' as any,
        'Fair': 'fair' as any,
        'Poor': 'poor' as any,
        'Unsafe': 'unsafe' as any,
      };

      const score: ProductCompatibilityScore = {
        score: BigInt(numericScore),
        verdict: verdictMap[verdictStr] ?? ('fair' as any),
      };

      return { results: enrichedResults, score };
    },
  });
}

export function useGetFavorites() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['favorites'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFavorites();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddFavorite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productName: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFavorite(productName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useRemoveFavorite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productName: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeFavorite(productName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useGetRoutines() {
  const { actor, isFetching } = useActor();

  return useQuery<SkincareRoutine[]>({
    queryKey: ['routines'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRoutines();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveRoutine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routine: SkincareRoutine) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveRoutine(routine);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    },
  });
}

export function useDeleteRoutine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routineName: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteRoutine(routineName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routines'] });
    },
  });
}

export function useGetProductNotes() {
  const { actor, isFetching } = useActor();

  return useQuery<ProductNote[]>({
    queryKey: ['productNotes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddProductNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: ProductNote) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProductNote(note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productNotes'] });
    },
  });
}

export function useCompareProducts() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ productNames, skinType }: { productNames: string[]; skinType: SkinType }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.compareProducts(productNames, skinType);
    },
  });
}

export function useGetAllIngredients() {
  const { actor, isFetching } = useActor();

  return useQuery<IngredientInfo[]>({
    queryKey: ['allIngredients'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllIngredients();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetIngredient(name: string) {
  const { actor, isFetching } = useActor();

  return useQuery<IngredientInfo | null>({
    queryKey: ['ingredient', name],
    queryFn: async () => {
      if (!actor || !name) return null;
      return actor.getIngredient(name);
    },
    enabled: !!actor && !isFetching && !!name,
  });
}

export function useProductSuitabilityCheck() {
  const { actor } = useActor();

  return useMutation<SuitabilityResult, Error, { productNameOrIngredients: string; userSkinType: SkinType; concerns: SkinConcerns }>({
    mutationFn: async ({ productNameOrIngredients, userSkinType, concerns }) => {
      if (!actor) throw new Error('Actor not available');

      const result = await actor.evaluateProductSuitability(
        productNameOrIngredients,
        userSkinType,
        concerns
      );

      return result;
    },
  });
}

export function useProductAutocomplete(inputValue: string) {
  const { actor, isFetching } = useActor();

  const { data: allProductNames = [], isLoading } = useQuery<string[]>({
    queryKey: ['allProductNames'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProductNames();
    },
    enabled: !!actor && !isFetching,
  });

  const suggestions = useMemo(() => {
    if (!inputValue || inputValue.length < 2) return [];
    const lower = inputValue.toLowerCase();
    return allProductNames.filter((name) => name.toLowerCase().includes(lower)).slice(0, 8);
  }, [allProductNames, inputValue]);

  return { suggestions, isLoading };
}
