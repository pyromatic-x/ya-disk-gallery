import { useMutation } from "@tanstack/react-query";
import { action_notify_about_bug } from "@/actions";
import { TMutationConfig } from "../types";

export const use_notify_about_bug_mutation = (
  config: TMutationConfig<typeof action_notify_about_bug>,
) =>
  useMutation({
    ...config,
    mutationFn: action_notify_about_bug,
  });
