export const connectivityExamples = {
  actorInitialization: `// Actor Initialization with Authentication
// File: frontend/src/hooks/useActor.ts

import { useQuery } from '@tanstack/react-query';
import { createActor } from '../backend';
import { useInternetIdentity } from './useInternetIdentity';

export function useActor() {
  const { identity, isInitializing } = useInternetIdentity();

  const { data: actor, isFetching } = useQuery({
    queryKey: ['actor', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!identity) return null;
      
      // Create actor with authenticated identity
      const actor = createActor({
        agentOptions: {
          identity,
        },
      });
      
      return actor;
    },
    enabled: !!identity && !isInitializing,
    staleTime: Infinity, // Actor doesn't change
  });

  return { actor, isFetching: isFetching || isInitializing };
}`,

  authentication: `// Internet Identity Authentication Flow
// File: frontend/src/hooks/useInternetIdentity.ts

import { AuthClient } from '@dfinity/auth-client';
import { useState, useEffect } from 'react';

export function useInternetIdentity() {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [identity, setIdentity] = useState(null);
  const [loginStatus, setLoginStatus] = useState('idle');

  // Initialize auth client on mount
  useEffect(() => {
    AuthClient.create().then(client => {
      setAuthClient(client);
      // Check if user is already authenticated
      if (client.isAuthenticated()) {
        setIdentity(client.getIdentity());
      }
    });
  }, []);

  // Login function
  const login = async () => {
    if (!authClient) return;
    
    setLoginStatus('logging-in');
    try {
      await authClient.login({
        identityProvider: 'https://identity.ic0.app',
        onSuccess: () => {
          const identity = authClient.getIdentity();
          setIdentity(identity);
          setLoginStatus('success');
        },
        onError: (error) => {
          console.error('Login failed:', error);
          setLoginStatus('error');
        },
      });
    } catch (error) {
      setLoginStatus('error');
    }
  };

  // Logout function
  const clear = async () => {
    if (!authClient) return;
    await authClient.logout();
    setIdentity(null);
    setLoginStatus('idle');
  };

  return { login, clear, loginStatus, identity };
}`,

  queryHooks: `// React Query Hooks for Data Fetching
// File: frontend/src/hooks/useQueries.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SkinTypeData, UserProfile, SkincareProduct } from '../backend';

// Query Hook: Get User Profile
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

// Query Hook: Get Skin Type Detection Results
export function useGetSkinTypeData() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SkinTypeData[]>({
    queryKey: ['skinTypeData'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSkinTypeDetectionResults();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Query Hook: Get Product Recommendations
export function useGetRecommendations(skinType: string, concerns: any) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SkincareProduct[]>({
    queryKey: ['recommendations', skinType, concerns],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPersonalizedRecommendations(skinType, concerns);
    },
    enabled: !!actor && !actorFetching && !!skinType,
  });
}

// Query Hook: Get Favorites
export function useGetFavorites() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['favorites'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFavorites();
    },
    enabled: !!actor && !actorFetching,
  });
}`,

  mutationHooks: `// React Query Mutation Hooks
// File: frontend/src/hooks/useQueries.ts (continued)

// Mutation Hook: Save Skin Type Data
export function useSaveSkinTypeData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skinTypeData: SkinTypeData) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveSkinTypeData(skinTypeData);
    },
    onSuccess: () => {
      // Invalidate and refetch skin type data
      queryClient.invalidateQueries({ queryKey: ['skinTypeData'] });
    },
    onError: (error) => {
      console.error('Failed to save skin type data:', error);
    },
  });
}

// Mutation Hook: Add Favorite
export function useAddFavorite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productName: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFavorite(productName);
    },
    onSuccess: () => {
      // Invalidate favorites query to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

// Mutation Hook: Save Routine
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

// Mutation Hook: Save User Profile
export function useSaveUserProfile() {
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
}`,

  errorHandling: `// Error Handling Patterns

// In Components:
function MyComponent() {
  const { data, isLoading, error } = useGetSkinTypeData();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-red-600">
        Error loading data: {error.message}
      </div>
    );
  }

  return <div>{/* Render data */}</div>;
}

// In Mutations with try-catch:
const saveMutation = useSaveSkinTypeData();

const handleSave = async () => {
  try {
    await saveMutation.mutateAsync(skinTypeData);
    toast.success('Saved successfully!');
  } catch (error) {
    console.error('Save failed:', error);
    toast.error('Failed to save. Please try again.');
  }
};

// Backend Error Handling (Motoko):
// When backend traps with Debug.trap(), frontend receives error
public shared ({ caller }) func restrictedOperation() : async () {
  if (not hasPermission(caller)) {
    Debug.trap("Unauthorized: Only users can perform this operation");
  };
  // ... operation logic
};`,

  loadingStates: `// Loading State Management

// Using React Query built-in states:
function ProductList() {
  const { data: products, isLoading, isFetching } = useGetRecommendations(skinType, concerns);

  return (
    <div>
      {isLoading && <Skeleton />}
      {isFetching && <div className="text-sm text-gray-500">Updating...</div>}
      {products?.map(product => <ProductCard key={product.name} product={product} />)}
    </div>
  );
}

// Mutation loading states with button:
function AddFavoriteButton({ productName }: { productName: string }) {
  const addFavorite = useAddFavorite();

  return (
    <Button
      onClick={() => addFavorite.mutate(productName)}
      disabled={addFavorite.isPending}
    >
      {addFavorite.isPending ? 'Adding...' : 'Add to Favorites'}
    </Button>
  );
}

// Cache configuration for optimal loading:
const query = useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
});`
};
