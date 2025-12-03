import { action_increment_file_views } from "@actions";
import { FileProvider, FolderProvider, prefetch_file, prefetch_folder } from "@queries";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { isValidObjectId } from "mongoose";
import { notFound } from "next/navigation";
import { QUERY_KEY_FILE, QUERY_KEY_FOLDER } from "@/constants/query";
import { get_query_client } from "@/lib/query-client";
import { FileControls } from "./_components/controls";
import { FileSidebar } from "./_components/sidebar";
import { FileWrapper } from "./_components/wrapper";

export default async function Page({
  params,
}: Readonly<{
  params: Promise<{ folder: string; file: string }>;
}>) {
  const { folder: folder_id, file: file_id } = await params;

  if (!isValidObjectId(folder_id) || !isValidObjectId(folder_id)) notFound();

  const client = get_query_client();
  await prefetch_folder(client, { id: folder_id });
  await prefetch_file(client, { id: file_id });

  const folder = client.getQueryCache().find({ queryKey: [QUERY_KEY_FOLDER(folder_id)] });
  const file = client.getQueryCache().find({ queryKey: [QUERY_KEY_FILE(file_id)] });

  if (!folder?.state?.data || !file?.state?.data) notFound();

  action_increment_file_views(file_id);

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <FolderProvider id={folder_id}>
        <FileProvider id={file_id}>
          <FileSidebar>
            <div className="w-full h-screen flex items-center justify-center relative overflow-hidden">
              <FileWrapper />
              <FileControls />
            </div>
          </FileSidebar>
        </FileProvider>
      </FolderProvider>
    </HydrationBoundary>
  );
}
