import { action_scan_folders } from "@actions";
import { useMutation } from "@tanstack/react-query";
import { MUTATION_KEY_FOLDERS_SCAN } from "@/constants/mutations";
import { TMutationConfig } from "../types";

export const use_scan_folders_mutation = (config: TMutationConfig<typeof action_scan_folders>) =>
  useMutation({
    ...config,
    mutationKey: [MUTATION_KEY_FOLDERS_SCAN],
    mutationFn: action_scan_folders,
  });
