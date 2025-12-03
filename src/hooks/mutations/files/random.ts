import { action_get_random_file } from "@actions";
import { useMutation } from "@tanstack/react-query";
import { TMutationConfig } from "../types";

export const use_get_random_file_mutation = (
  config: TMutationConfig<typeof action_get_random_file>,
) =>
  useMutation({
    ...config,
    mutationFn: action_get_random_file,
  });
