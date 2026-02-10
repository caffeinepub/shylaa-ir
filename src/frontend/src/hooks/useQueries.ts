import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile, PlatformCatalogEntry, PlatformCategory, SubmissionPlan, ContentDraft } from '../backend';

// User Profile
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

// Authorization
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isAdmin', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

// Platform Catalog
export function useSearchPlatforms(category: PlatformCategory | null, country: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<PlatformCatalogEntry[]>({
    queryKey: ['platforms', category, country],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchCatalogEntries(category, country);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPlatform() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: PlatformCatalogEntry) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPlatformCatalogEntry(entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
    },
  });
}

export function useUpdatePlatform() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, entry }: { id: bigint; entry: PlatformCatalogEntry }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePlatformCatalogEntry(id, entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platforms'] });
    },
  });
}

// Submission Plans
export function useGetSubmissionPlans() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<SubmissionPlan[]>({
    queryKey: ['submissionPlans', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getSubmissionPlans(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useCreateOrUpdateSubmissionPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plan: SubmissionPlan) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrUpdateSubmissionPlan(plan);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissionPlans'] });
    },
  });
}

// Content Drafts
export function useGenerateOrUpdateDraft() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (draft: ContentDraft) => {
      if (!actor) throw new Error('Actor not available');
      return actor.generateOrUpdateContentDraft(draft);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentDrafts'] });
    },
  });
}
