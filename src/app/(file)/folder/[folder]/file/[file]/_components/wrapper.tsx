"use client";

import { useFile } from "@queries";
import Image from "next/image";
import { useEffect, useState } from "react";
import { EventBus } from "@/lib/event-bus";
import { cn } from "@/lib/utils";
import { Spinner } from "@/ui/shared/spinner";

export const FileWrapper = () => {
  const { data: file } = useFile();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cleanup = EventBus.subscribe("navigated-to-sibling-file", () => {
      setIsLoading(true);
    });

    return () => {
      cleanup();
    };
  }, []);

  return (
    <>
      <Spinner
        className={cn([
          "size-10",
          "absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] transition-opacity text-yellow-500 duration-500",
          !isLoading && "opacity-0",
        ])}
      />
      {file.media_type === "image" ? (
        <Image
          priority
          unoptimized={true}
          src={`/proxy/image?url=${encodeURIComponent(file.full_url)}`}
          alt={String(file.folder)}
          width={1500}
          height={1500}
          className={cn([
            "h-full object-contain opacity-0 transition-opacity duration-500",
            !isLoading && "opacity-100",
          ])}
          onLoad={() => setIsLoading(false)}
        />
      ) : (
        <video
          autoPlay
          muted
          loop
          src={`/proxy/video?url=${encodeURIComponent(file.full_url)}`}
          width={1000}
          height={1000}
          className={cn([
            "h-full object-contain opacity-0 transition-opacity duration-500",
            !isLoading && "opacity-100",
          ])}
          onLoad={() => setIsLoading(false)}
          onLoadedMetadata={() => setIsLoading(false)}
          onLoadedData={() => setIsLoading(false)}
          controls
        />
      )}
    </>
  );
};
