import { action_update_folder_links } from "@actions";
import { useMutation } from "@tanstack/react-query";
import { TMutationConfig } from "../types";

export const use_update_folder_links_mutation = (
  config: TMutationConfig<typeof action_update_folder_links>,
) =>
  useMutation({
    ...config,
    mutationFn: action_update_folder_links,
  });
