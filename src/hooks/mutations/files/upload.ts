import { action_upload_files } from "@actions";
import { useMutation } from "@tanstack/react-query";
import { MUTATION_KEY_FILES_UPLOAD } from "@/constants/mutations";
import { TMutationConfig } from "../types";

export const use_upload_files_mutation = (config: TMutationConfig<typeof action_upload_files>) =>
  useMutation({
    ...config,
    mutationKey: [MUTATION_KEY_FILES_UPLOAD],
    mutationFn: action_upload_files,
  });
