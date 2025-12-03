import { useFolder } from "@queries";
import { useMutationState } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MUTATION_KEY_FILES_SET_AS_PREVIEW } from "@/constants/mutations";
import { cn } from "@/lib/utils";
import { SidebarGroup, SidebarGroupContent, useSidebar } from "@/ui/layout/sidebar/sidebar";
import { Spinner } from "@/ui/shared/spinner";

export const FolderSidebarPreview = () => {
  const { open, isMobile } = useSidebar();
  const { data: folder } = useFolder();

  const [isLoading, setIsLoading] = useState(false);

  const mutationStatus = useMutationState({
    filters: { mutationKey: [MUTATION_KEY_FILES_SET_AS_PREVIEW] },
    select: (mutation) => mutation.state.status,
  }).pop();

  useEffect(() => {
    if (mutationStatus === "pending") setIsLoading(true);
  }, [mutationStatus]);

  if (!open && !isMobile) return;

  return (
    <SidebarGroup className="px-5.5">
      <SidebarGroupContent>
        <div className="w-full h-full relative aspect-square">
          <Spinner
            className={cn([
              "size-8",
              "text-yellow-500",
              "absolute transition-opacity duration-500 rounded-[6px] opacity-0",
              "top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]",
              isLoading && "opacity-100",
            ])}
          />
          <Image
            priority
            unoptimized={true}
            src={`/proxy/image?url=${encodeURIComponent(folder?.preview_url)}`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.jpg";
            }}
            alt={folder?.names[0] || ""}
            width={200}
            height={200}
            className={cn([
              "aspect-square object-cover w-full h-full transition-opacity duration-500 rounded-[6px]",
              isLoading && "opacity-0",
            ])}
            onLoadStart={() => setIsLoading(true)}
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
