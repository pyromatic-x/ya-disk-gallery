import { action_rearrange_files } from "@actions";
import { useMutation } from "@tanstack/react-query";
import { MUTATION_KEY_FILES_REARRANGE } from "@/constants/mutations";
import { TMutationConfig } from "../types";

export const use_rearrange_files_mutation = (
  config?: TMutationConfig<typeof action_rearrange_files>,
) =>
  useMutation({
    ...config,
    mutationKey: [MUTATION_KEY_FILES_REARRANGE],
    mutationFn: action_rearrange_files,
  });
