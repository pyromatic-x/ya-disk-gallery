import { action_create_folder } from "@actions";
import { useMutation } from "@tanstack/react-query";
import { TMutationConfig } from "../types";

export const use_create_folder_mutation = (config: TMutationConfig<typeof action_create_folder>) =>
  useMutation({
    ...config,
    mutationFn: action_create_folder,
  });
