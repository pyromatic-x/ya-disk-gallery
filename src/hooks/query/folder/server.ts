import { action_get_folder } from "@actions";
import { QueryClient, queryOptions } from "@tanstack/react-query";
import { QUERY_KEY_FOLDER } from "@/constants/query";

type TPayload = Parameters<typeof action_get_folder>[0];

export const get_useFolder_options = (payload: TPayload) =>
  queryOptions({
    queryKey: [QUERY_KEY_FOLDER(payload.id)],
    queryFn: () => action_get_folder(payload),
  });

export const prefetch_folder = (client: QueryClient, payload: TPayload) =>
  client.prefetchQuery(get_useFolder_options(payload));
