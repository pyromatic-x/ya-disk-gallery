import { action_update_folder_tags } from "@actions";
import { useMutation } from "@tanstack/react-query";
import { TMutationConfig } from "../types";

export const use_update_folder_tags_mutation = (
  config: TMutationConfig<typeof action_update_folder_tags>,
) =>
  useMutation({
    ...config,
    mutationFn: action_update_folder_tags,
  });
