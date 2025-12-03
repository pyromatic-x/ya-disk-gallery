"use client";

import { action_get_many_folders } from "@actions";
import { useFolders } from "@queries";
import { HeartCrack } from "lucide-react";
import { FolderCard } from "./folder-card";

export const Folders = ({ params }: { params: Parameters<typeof action_get_many_folders>[0] }) => {
  const { data: folders } = useFolders(params);

  return !folders?.length ? (
    <div className="w-full h-screen flex items-center justify-center">
      <HeartCrack size={30} className="text-yellow-500" />
      <span className="ml-2 font-medium text-2xl">Nothing found</span>
    </div>
  ) : (
    <div
      className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-0.5 w-full"
      style={{ gridAutoRows: "max-content" }}
    >
      {folders.map((folder) => (
        <FolderCard key={folder._id} file={folder} />
      ))}
    </div>
  );
};
