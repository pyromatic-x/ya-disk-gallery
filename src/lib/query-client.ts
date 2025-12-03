import type { DefaultOptions } from "@tanstack/react-query";
import { defaultShouldDehydrateQuery, isServer, QueryClient } from "@tanstack/react-query";
import SuperJSON from "superjson";

export const queryConfig: DefaultOptions = {
  queries: {
    staleTime: 5 * 60 * 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  },
  dehydrate: {
    serializeData: SuperJSON.serialize,
    shouldDehydrateQuery: (query) =>
      defaultShouldDehydrateQuery(query) || query.state.status === "pending",
  },
  hydrate: {
    deserializeData: SuperJSON.deserialize,
  },
};

let browser_query_client: QueryClient | undefined;

const create_query_client = () => new QueryClient({ defaultOptions: queryConfig });

export const get_query_client = () => {
  if (isServer) {
    return create_query_client();
  } else {
    if (!browser_query_client) browser_query_client = create_query_client();
    return browser_query_client;
  }
};
