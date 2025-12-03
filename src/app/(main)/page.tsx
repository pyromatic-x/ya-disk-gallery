import { action_get_many_folders } from "@actions";
import { prefetch_counts, prefetch_folders, prefetch_tags } from "@queries";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { get_query_client } from "@/lib/query-client";
import { Folders } from "./_components/folders";
import { HomeSidebar } from "./_components/sidebar";

export default async function Page({
  searchParams,
}: {
  searchParams: Parameters<typeof action_get_many_folders>[0];
}) {
  const params = await searchParams;

  const client = get_query_client();
  await prefetch_folders(client, params);
  await prefetch_tags(client);
  await prefetch_counts(client);

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <HomeSidebar>
        <Folders params={params} />
      </HomeSidebar>
    </HydrationBoundary>
  );
}
