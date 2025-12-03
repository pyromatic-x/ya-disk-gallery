import { prefetch_charts } from "@queries";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Flame } from "lucide-react";
import Link from "next/link";
import { get_query_client } from "@/lib/query-client";
import { Charts } from "./_components";

export default async function Page() {
  const client = get_query_client();
  await prefetch_charts(client);

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <div className="container flex flex-col items-center justify-center mx-auto py-10 px-3">
        <Link href="/" className="text-center inline-flex gap-1 font-medium mb-6">
          <Flame className="text-yellow-500" /> hiddenfolder
        </Link>
        <Charts />
      </div>
    </HydrationBoundary>
  );
}
