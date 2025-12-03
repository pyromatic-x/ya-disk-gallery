import { action_get_file } from "@actions";
import { QueryClient, queryOptions } from "@tanstack/react-query";
import { QUERY_KEY_FILE } from "@/constants/query";

type TPayload = Parameters<typeof action_get_file>[0];

export const get_useFile_options = (payload: TPayload) =>
  queryOptions({
    queryKey: [QUERY_KEY_FILE(payload.id)],
    queryFn: () => action_get_file(payload),
  });

export const prefetch_file = (client: QueryClient, payload: TPayload) =>
  client.prefetchQuery(get_useFile_options(payload));
