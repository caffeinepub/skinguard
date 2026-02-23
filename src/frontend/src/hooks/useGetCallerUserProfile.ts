import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { User } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<User | null>({
    queryKey: ['currentUserProfile'],
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
