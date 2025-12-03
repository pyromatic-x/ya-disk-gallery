"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import dayjs from "dayjs";
import RelativeTime from "dayjs/plugin/relativeTime";
import { get_query_client } from "@/lib/query-client";

dayjs.extend(RelativeTime);

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = get_query_client();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
