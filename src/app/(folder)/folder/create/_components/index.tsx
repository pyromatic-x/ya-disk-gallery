"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { use_create_folder_mutation } from "@mutations";
import { useRouter } from "nextjs-toploader/app";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/ui/form/button";
import { Form } from "@/ui/form/form";
import { CreateFolderFormFiles } from "./files";
import { CreateFolderFormLinks } from "./links";
import { CreateFolderFormNames } from "./names";
import { CreateFolderFormPreview } from "./preview";
import { CreateFolderFormTags } from "./tags";

interface TFile {
  file: File;
  name: string;
  mime_type: string;
  size: number;
  url: string;
}

export interface TCreateFolderForm {
  names: Array<string>;
  files?: Array<TFile>;
  tags?: Array<string>;
  links?: Array<string>;
}

const schema = z.object({
  names: z.array(z.string()).nonempty(),
  tags: z.array(z.string()).optional(),
  links: z.array(z.string()).optional(),
  files: z
    .array(
      z.object({
        file: z.file(),
        name: z.string(),
        mime_type: z.string(),
        size: z.number(),
        url: z.string(),
      }),
    )
    .optional(),
});

export const CreateFolderForm = () => {
  const router = useRouter();

  const form = useForm<TCreateFolderForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      names: [],
    },
  });

  const { mutate, isPending } = use_create_folder_mutation({
    onSuccess: (id) => {
      router.push(`/folder/${id}`);
    },
    onError: (error) => {
      toast.error(
        <div>
          <p className="mb-2">An error occured. Please, try again.</p>
          <div>{error.message}</div>
        </div>,
      );
    },
  });

  const handleOnSubmit: SubmitHandler<TCreateFolderForm> = ({ files, tags, links, names }) => {
    mutate({
      files: (files || []).flatMap((t) => t.file),
      tags: tags || [],
      links: links || [],
      names,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleOnSubmit)}
        className="flex flex-col gap-10 w-full p-3 md:p-8 rounded-2xl bg-accent/20"
      >
        <CreateFolderFormPreview />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CreateFolderFormNames />
          <CreateFolderFormLinks />
        </div>
        <CreateFolderFormTags />
        <CreateFolderFormFiles />
        <Button type="submit" disabled={isPending || !form.formState.isValid}>
          Create
        </Button>
      </form>
    </Form>
  );
};
