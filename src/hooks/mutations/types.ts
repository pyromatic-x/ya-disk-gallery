import { UseMutationOptions } from "@tanstack/react-query";

export type TMutationConfig<
  // biome-ignore lint/suspicious/noExplicitAny: skip
  MutationFn extends (...args: any) => Promise<any>,
> = Omit<
  UseMutationOptions<
    Awaited<ReturnType<MutationFn>>,
    Error,
    Parameters<MutationFn>["length"] extends 0 ? void : Parameters<MutationFn>[0]
  >,
  "mutationFn"
>;
