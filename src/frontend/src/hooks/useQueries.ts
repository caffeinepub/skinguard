import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { 
  SkinType, 
  SkincareProduct, 
  IngredientAnalysisResult, 
  ProductCompatibilityScore, 
  SkinConcerns,
  SkincareRoutine,
  ProductNote,
  IngredientInfo,
  SuitabilityResult,
  User,
  ConcernLevel
} from '../backend';
import { useMemo } from 'react';

// Temporary type definitions until backend provides these
type SkinTypeData = {
  answers: bigint[];
  detectedSkinType: SkinType;
  concerns: SkinConcerns;
  timestamp: bigint;
};

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
      // Use updateUserProfileIntro with default values for age and email
      return actor.updateUserProfileIntro(profile.name, BigInt(25), null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfileIntro'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetSkinTypeDetectionResults() {
  const { actor, isFetching } = useActor();

  return useQuery<SkinTypeData[]>({
    queryKey: ['skinTypeResults'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method missing - return empty array
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetLatestSkinType() {
  const { actor, isFetching } = useActor();

  return useQuery<SkinType | null>({
    queryKey: ['latestSkinType'],
    queryFn: async () => {
      if (!actor) return null;
      // Backend method missing - return null
      return null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveSkinTypeData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skinTypeData: SkinTypeData) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method missing - throw error
      throw new Error('Backend method saveSkinTypeData not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skinTypeResults'] });
      queryClient.invalidateQueries({ queryKey: ['latestSkinType'] });
      queryClient.invalidateQueries({ queryKey: ['progressMetrics'] });
    },
  });
}

export function useGetProgressMetrics() {
  const { actor, isFetching } = useActor();

  return useQuery<ProgressMetrics>({
    queryKey: ['progressMetrics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend method missing - return default metrics
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

export function useAnalyzeIngredients() {
  const { actor } = useActor();

  return useMutation<
    { results: IngredientAnalysisResult[]; score: ProductCompatibilityScore },
    Error,
    { ingredientNames: string[]; skinType: SkinType }
  >({
    mutationFn: async ({ ingredientNames, skinType }) => {
      if (!actor) throw new Error('Actor not available');

      const results = await actor.analyzeIngredients(ingredientNames, skinType);
      const score = await actor.calculateProductCompatibilityScore(results);

      return { results, score };
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
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const filteredSuggestions = useMemo(() => {
    if (!inputValue.trim()) return [];
    
    const searchTerm = inputValue.toLowerCase().trim();
    return allProductNames
      .filter(name => name.toLowerCase().includes(searchTerm))
      .slice(0, 10); // Limit to 10 suggestions
  }, [allProductNames, inputValue]);

  return {
    suggestions: filteredSuggestions,
    isLoading,
  };
}
