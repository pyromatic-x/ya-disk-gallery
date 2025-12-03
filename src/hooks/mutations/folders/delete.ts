import { action_delete_folder } from "@actions";
import { useMutation } from "@tanstack/react-query";
import { TMutationConfig } from "../types";

export const use_delete_folder_mutation = (config: TMutationConfig<typeof action_delete_folder>) =>
  useMutation({
    ...config,
    mutationFn: action_delete_folder,
  });
