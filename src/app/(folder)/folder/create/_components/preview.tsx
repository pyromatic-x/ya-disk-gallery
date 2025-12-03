"use client";

import { useTags } from "@queries";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Badge } from "@/ui/shared/badge";
import { TCreateFolderForm } from ".";

export const CreateFolderFormPreview = () => {
  const { data: _tags } = useTags();
  const { watch } = useFormContext<TCreateFolderForm>();

  const { names, links, tags, files } = watch();

  const name = (names || [])[0];

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="max-w-[355px] max-h-[355px] w-full h-full aspect-square rounded-[6px] overflow-hidden bg-red-50 mb-4">
        {files?.length ? (
          <Image
            src={files[0].url}
            className="rounded-[6px] h-full object-cover"
            width={355}
            height={355}
            alt={name || ""}
          />
        ) : (
          <Image
            src="/placeholder.jpg"
            className="rounded-[6px] w-full h-full object-cover"
            width={355}
            height={355}
            alt={name || ""}
          />
        )}
      </div>

      <p className="text-2xl font-medium mb-5">{name || "Nameless folder"}</p>
      <div className="max-w-[400px] mx-auto">
        {Boolean(names?.length > 1) && (
          <div className="flex flex-wrap gap-1 mb-4">
            {names.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        )}

        {Boolean(links?.length) && (
          <div className="flex flex-wrap gap-1 mb-4">
            {links?.map((t) => (
              <Badge key={t}>{getHostname(t)}</Badge>
            ))}
          </div>
        )}

        {Boolean(tags?.length) && (
          <div className="flex flex-wrap gap-1">
            {tags?.map((tag) => (
              <Badge
                key={tag}
                variant="default"
                className={cn(["text-sm cursor-pointer", "hover:bg-primary/85"])}
              >
                {_tags.find((t) => t._id === tag)?.value}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="w-full h-px bg-accent mt-4 mb-0 md:mb-10" />
    </div>
  );
};

const getHostname = (link: string) => {
  const urlWithProtocol = link.includes("://") ? link : `https://${link}`;
  const raw = new URL(urlWithProtocol).hostname;

  return raw.replaceAll("www.", "");
};
