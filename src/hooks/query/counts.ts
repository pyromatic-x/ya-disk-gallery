import { action_get_counts } from "@actions";
import { QueryClient, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { QUERY_KEY_COUNTS } from "@/constants/query";

const get_options = () =>
  queryOptions({
    queryKey: [QUERY_KEY_COUNTS],
    queryFn: action_get_counts,
  });

export const prefetch_counts = (client: QueryClient) => client.prefetchQuery(get_options());

export const useCounts = () => useSuspenseQuery(get_options());
