import { action_login } from "@actions";
import { useMutation } from "@tanstack/react-query";
import { MUTATION_KEY_LOGIN } from "@/constants/mutations";
import { TMutationConfig } from "../types";

export const use_login_mutation = (config: TMutationConfig<typeof action_login>) =>
  useMutation({
    ...config,
    mutationKey: [MUTATION_KEY_LOGIN],
    mutationFn: action_login,
  });
