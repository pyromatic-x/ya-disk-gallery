import { action_get_many_folders } from "@actions";
import { QueryClient, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { QUERY_KEY_FOLDERS } from "@/constants/query";

type TPayload = Parameters<typeof action_get_many_folders>[0];

const get_options = (payload: TPayload) =>
  queryOptions({
    queryKey: [QUERY_KEY_FOLDERS, ...Object.keys(payload || {})],
    queryFn: () => action_get_many_folders(payload),
  });

export const prefetch_folders = (client: QueryClient, payload: TPayload) =>
  client.prefetchQuery(get_options(payload));

export const useFolders = (payload: TPayload) => useSuspenseQuery(get_options(payload));
