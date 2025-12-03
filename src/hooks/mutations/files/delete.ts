import { action_delete_file } from "@actions";
import { useMutation } from "@tanstack/react-query";
import { MUTATION_KEY_FILES_DELETE } from "@/constants/mutations";
import { TMutationConfig } from "../types";

export const use_delete_file_mutation = (config: TMutationConfig<typeof action_delete_file>) =>
  useMutation({
    ...config,
    mutationKey: [MUTATION_KEY_FILES_DELETE],
    mutationFn: action_delete_file,
  });
