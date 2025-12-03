import { action_get_tags } from "@actions";
import { QueryClient, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { QUERY_KEY_TAGS } from "@/constants/query";

const get_options = () =>
  queryOptions({
    queryKey: [QUERY_KEY_TAGS],
    queryFn: action_get_tags,
  });

export const prefetch_tags = (client: QueryClient) => client.prefetchQuery(get_options());

export const useTags = () => useSuspenseQuery(get_options());
