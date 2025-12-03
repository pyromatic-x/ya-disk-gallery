import { action_get_charts } from "@actions";
import { QueryClient, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { QUERY_KEY_CHARTS } from "@/constants/query";

const get_options = () =>
  queryOptions({
    queryKey: [QUERY_KEY_CHARTS],
    queryFn: action_get_charts,
  });

export const prefetch_charts = (client: QueryClient) => client.prefetchQuery(get_options());

export const useCharts = () => useSuspenseQuery(get_options());
