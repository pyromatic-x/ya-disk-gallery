"use client";

import { use_set_as_preview_mutation } from "@mutations";
import { TFile } from "@schemas";
import { toast } from "sonner";
import { QUERY_KEY_FOLDER } from "@/constants/query";
import { get_query_client } from "@/lib/query-client";
import { ContextMenuItem } from "@/ui/ux/context-menu";

export const FileCardMenuSetAsPreview = ({ _id, folder, path }: TFile) => {
  const { mutateAsync } = use_set_as_preview_mutation({
    onSuccess: () => {
      get_query_client().invalidateQueries({ queryKey: [QUERY_KEY_FOLDER(String(folder))] });
      toast.success("Preview updated.");
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });

  const handleOnPreview = () =>
    mutateAsync({
      folder_id: String(folder),
      file_id: _id,
      file_path: path,
    });

  return <ContextMenuItem onClick={handleOnPreview}>Set as preview</ContextMenuItem>;
};
