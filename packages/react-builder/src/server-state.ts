import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";
import {
  type AdapterResult,
  type FormPersistenceAdapter,
  type ListRevisionsData,
  type LoadFormData,
  type LoadFormRequest,
  type PublishRevisionData,
  type PublishRevisionRequest,
  type SaveDraftData,
  type SaveDraftRequest,
  type SubmitFormData,
  type SubmitFormRequest
} from "@your-org/forms-adapters";

import { createPersistenceState, type BuilderPersistenceState } from "./persistence.js";

export interface BuilderServerState {
  draft: LoadFormData | null;
  revisions: ListRevisionsData | null;
  persistenceState: BuilderPersistenceState;
  saveDraft: (request: SaveDraftRequest) => Promise<AdapterResult<SaveDraftData>>;
  publishRevision: (request: PublishRevisionRequest) => Promise<AdapterResult<PublishRevisionData>>;
  submitForm: (request: SubmitFormRequest) => Promise<AdapterResult<SubmitFormData>>;
  reload: () => Promise<void>;
}

export interface UseBuilderServerStateOptions {
  adapter: FormPersistenceAdapter;
  request: LoadFormRequest;
  enabled?: boolean;
}

export function useBuilderServerState(options: UseBuilderServerStateOptions): BuilderServerState {
  const queryClient = useQueryClient();
  const enabled = options.enabled ?? true;
  const formKey = ["forms-builder", options.request.formId] as const;
  const draftQuery = useQuery({
    queryKey: [...formKey, "draft", options.request.draftId ?? "default"],
    enabled,
    queryFn: () => options.adapter.loadForm(options.request)
  });
  const revisionsQuery = useQuery({
    queryKey: [...formKey, "revisions"],
    enabled,
    queryFn: () => options.adapter.listRevisions(options.request)
  });
  const saveMutation = useMutation({
    mutationFn: (request: SaveDraftRequest) => Promise.resolve(options.adapter.saveDraft(request)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: formKey });
    }
  });
  const publishMutation = useMutation({
    mutationFn: (request: PublishRevisionRequest) => Promise.resolve(options.adapter.publishRevision(request)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: formKey });
    }
  });
  const submitMutation = useMutation({
    mutationFn: (request: SubmitFormRequest) => Promise.resolve(options.adapter.submitForm(request))
  });

  const draftResult = draftQuery.data;
  const saveResult = saveMutation.data;
  const persistenceState = derivePersistenceState({
    loading: draftQuery.isLoading,
    fetching: draftQuery.isFetching,
    saving: saveMutation.isPending,
    draftResult,
    saveResult,
    error: draftQuery.error ?? saveMutation.error
  });

  return {
    draft: draftResult?.ok ? draftResult.data : null,
    revisions: revisionsQuery.data?.ok ? revisionsQuery.data.data : null,
    persistenceState,
    saveDraft: saveMutation.mutateAsync,
    publishRevision: publishMutation.mutateAsync,
    submitForm: submitMutation.mutateAsync,
    reload: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [...formKey, "draft"] }),
        queryClient.invalidateQueries({ queryKey: [...formKey, "revisions"] })
      ]);
    }
  };
}

function derivePersistenceState(input: {
  loading: boolean;
  fetching: boolean;
  saving: boolean;
  draftResult?: AdapterResult<LoadFormData> | undefined;
  saveResult?: AdapterResult<SaveDraftData> | undefined;
  error: Error | null;
}): BuilderPersistenceState {
  if (input.loading || input.fetching) {
    return createPersistenceState("loading");
  }
  if (input.saving) {
    return createPersistenceState("saving");
  }
  if (input.saveResult?.ok) {
    return createPersistenceState("saved", {
      draft: input.saveResult.data.draft,
      lastSavedAt: input.saveResult.data.savedAt
    });
  }
  if (input.saveResult && !input.saveResult.ok && input.saveResult.status === "conflict") {
    const options = {
      diagnostics: input.saveResult.diagnostics,
      canReload: input.saveResult.conflict?.canReload ?? true,
      canRetry: input.saveResult.conflict?.canRetry ?? false,
      ...(input.saveResult.message ? { message: input.saveResult.message } : {})
    };
    return createPersistenceState("conflicted", {
      ...options
    });
  }
  if (input.saveResult && !input.saveResult.ok) {
    return createPersistenceState("failed", {
      diagnostics: input.saveResult.diagnostics,
      ...(input.saveResult.message ? { message: input.saveResult.message } : {})
    });
  }
  if (input.draftResult?.ok) {
    return createPersistenceState("idle", { draft: input.draftResult.data.draft });
  }
  if (input.draftResult && !input.draftResult.ok) {
    return createPersistenceState("failed", {
      diagnostics: input.draftResult.diagnostics,
      ...(input.draftResult.message ? { message: input.draftResult.message } : {})
    });
  }
  if (input.error) {
    return createPersistenceState("failed", { message: input.error.message });
  }
  return createPersistenceState("idle");
}
