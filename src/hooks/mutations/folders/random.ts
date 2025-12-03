import { action_get_random_folder } from "@actions";
import { useMutation } from "@tanstack/react-query";
import { TMutationConfig } from "../types";

export const use_get_random_folder_mutation = (
  config: TMutationConfig<typeof action_get_random_folder>,
) =>
  useMutation({
    ...config,
    mutationFn: action_get_random_folder,
  });
