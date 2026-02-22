import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { 
  SkinTypeData, 
  UserProfile, 
  SkinType, 
  SkincareProduct, 
  IngredientAnalysisResult, 
  ProductCompatibilityScore, 
  SkinConcerns,
  ProgressMetrics,
  SkincareRoutine,
  ProductNote,
  IngredientInfo,
  SuitabilityResult
} from '../backend';
import { useMemo } from 'react';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
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

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
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
      const results = await actor.getSkinTypeDetectionResults();
      return results.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetLatestSkinType() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['latestSkinType'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLatestSkinType();
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
      return actor.saveSkinTypeData(skinTypeData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skinTypeResults'] });
      queryClient.invalidateQueries({ queryKey: ['latestSkinType'] });
      queryClient.invalidateQueries({ queryKey: ['progressMetrics'] });
    },
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
    string[]
  >({
    mutationFn: async (ingredientNames: string[]) => {
      if (!actor) throw new Error('Actor not available');
      
      const skinType = await actor.getLatestSkinType();
      
      if (!skinType) {
        throw new Error('Please complete the skin type questionnaire first');
      }

      const results = await actor.analyzeIngredients(ingredientNames, skinType);
      const score = await actor.calculateProductCompatibilityScore(results);

      return { results, score };
    },
  });
}

export function useGetProgressMetrics() {
  const { actor, isFetching } = useActor();

  return useQuery<ProgressMetrics>({
    queryKey: ['progressMetrics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProgressMetrics();
    },
    enabled: !!actor && !isFetching,
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
    mutationFn: async (productNames: string[]) => {
      if (!actor) throw new Error('Actor not available');
      
      const skinType = await actor.getLatestSkinType();
      if (!skinType) {
        throw new Error('Please complete the skin type questionnaire first');
      }

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

  return useMutation<SuitabilityResult, Error, string>({
    mutationFn: async (productNameOrIngredients: string) => {
      if (!actor) throw new Error('Actor not available');

      const skinTypeResults = await actor.getSkinTypeDetectionResults();
      
      if (!skinTypeResults || skinTypeResults.length === 0) {
        throw new Error('Please complete the skin type questionnaire first');
      }

      const sortedResults = skinTypeResults.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
      const latestResult = sortedResults[0];
      const userSkinType = latestResult.detectedSkinType;
      const concerns = latestResult.concerns;

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
