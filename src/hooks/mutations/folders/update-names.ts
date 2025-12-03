import { action_update_folder_names } from "@actions";
import { useMutation } from "@tanstack/react-query";
import { TMutationConfig } from "../types";

export const use_update_folder_names_mutation = (
  config: TMutationConfig<typeof action_update_folder_names>,
) =>
  useMutation({
    ...config,
    mutationFn: action_update_folder_names,
  });
