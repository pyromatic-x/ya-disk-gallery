import { action_set_file_as_preview } from "@actions";
import { useMutation } from "@tanstack/react-query";
import { MUTATION_KEY_FILES_SET_AS_PREVIEW } from "@/constants/mutations";
import { TMutationConfig } from "../types";

export const use_set_as_preview_mutation = (
  config: TMutationConfig<typeof action_set_file_as_preview>,
) =>
  useMutation({
    ...config,
    mutationKey: [MUTATION_KEY_FILES_SET_AS_PREVIEW],
    mutationFn: action_set_file_as_preview,
  });
