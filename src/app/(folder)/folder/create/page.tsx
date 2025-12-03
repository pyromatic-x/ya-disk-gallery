import { prefetch_tags } from "@queries";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Flame } from "lucide-react";
import Link from "next/link";
import { get_query_client } from "@/lib/query-client";
import { CreateFolderForm } from "./_components";

export default async function Page() {
  const client = get_query_client();
  await prefetch_tags(client);

  return (
    <HydrationBoundary state={dehydrate(client)}>
      <div className="p-3 md:p-10 md:max-w-[720px] mx-auto">
        <div className="w-full flex justify-center mb-6">
          <Link href="/" className="text-center inline-flex gap-1 font-medium ">
            <Flame className="text-yellow-500" /> hiddenfolder
          </Link>
        </div>
        <CreateFolderForm />
      </div>
    </HydrationBoundary>
  );
}
