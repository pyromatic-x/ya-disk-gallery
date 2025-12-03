"use client";

import { use_delete_file_mutation } from "@mutations";
import { TFile } from "@schemas";
import { toast } from "sonner";
import { QUERY_KEY_FOLDER } from "@/constants/query";
import { get_query_client } from "@/lib/query-client";
import { ContextMenuItem } from "@/ui/ux/context-menu";

export const FileCardMenuDelete = ({ folder, _id, path }: TFile) => {
  const { mutate } = use_delete_file_mutation({
    onSuccess: () => {
      get_query_client().invalidateQueries({ queryKey: [QUERY_KEY_FOLDER(String(folder))] });
      toast.success("File successfuly deleted.");
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });

  const handleOnDelete = () =>
    mutate({
      folder_id: String(folder),
      file_id: _id,
      file_path: path,
    });

  return (
    <ContextMenuItem onClick={handleOnDelete} className="text-red-500 hover:text-red-400!">
      Delete
    </ContextMenuItem>
  );
};
