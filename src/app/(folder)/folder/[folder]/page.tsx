import { action_increment_folder_views } from "@actions";
import { FolderProvider, prefetch_folder, prefetch_tags } from "@queries";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { isValidObjectId } from "mongoose";
import { notFound } from "next/navigation";
import { QUERY_KEY_FOLDER } from "@/constants/query";
import { get_query_client } from "@/lib/query-client";
import { FolderPageGrid } from "./_components/files";
import { FolderSidebar } from "./_components/sidebar";

export default async function Page({ params }: { params: Promise<{ folder: string }> }) {
  const { folder: folder_id } = await params;

  if (!isValidObjectId(folder_id)) notFound();

  const client = get_query_client();
  await prefetch_folder(client, { id: folder_id });
  await prefetch_tags(client);

  const folder = client.getQueryCache().find({ queryKey: [QUERY_KEY_FOLDER(folder_id)] });
  if (!folder?.state?.data) notFound();

  action_increment_folder_views(folder_id);

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <FolderProvider id={folder_id}>
        <FolderSidebar>
          <FolderPageGrid />
        </FolderSidebar>
      </FolderProvider>
    </HydrationBoundary>
  );
}
