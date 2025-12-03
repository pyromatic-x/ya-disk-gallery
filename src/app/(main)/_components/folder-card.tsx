"use client";

import { SidebarFolderControlsAddModal } from "@folder/sidebar/controls/add-modal";
import { use_scan_folders_mutation } from "@mutations";
import { ContextMenuLabel, ContextMenuSeparator } from "@radix-ui/react-context-menu";
import { TFolder } from "@schemas";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/ui/ux/context-menu";

export const FolderCard = ({ file }: { file: TFolder }) => {
  const { _id, names, preview_url } = file;

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Link
          href={`/folder/${_id}`}
          className="block relative overflow-hidden hover:[&_img]:scale-[1.15] aspect-square"
        >
          {preview_url ? (
            <Image
              loading="lazy"
              unoptimized={true}
              src={`/proxy/image?url=${encodeURIComponent(preview_url)}`}
              alt={names[0]}
              width={200}
              height={200}
              className={cn([`aspect-square object-cover w-full h-full transition-transform`])}
            />
          ) : (
            <Image
              loading="lazy"
              unoptimized={true}
              src={`/placeholder.jpg`}
              alt={names[0]}
              width={200}
              height={200}
              className={cn([`aspect-square object-cover w-full h-full `])}
            />
          )}

          <div
            className={cn([
              "caption absolute bottom-0 left-0 w-full p-2 h-[100px] flex items-end justify-center text-[14px] transition-all [&_p]:transition [&_p]:duration-300",
            ])}
            style={{
              background: `linear-gradient(0deg,rgba(0, 0, 0, 1) 0%, rgba(138, 125, 255, 0) 100%)`,
            }}
          >
            <p className="font-medium line-clamp-1">{names[0]}</p>
          </div>

          <div
            className={cn([
              "absolute top-0 right-0 w-full h-full bg-black/80 flex items-center justify-center opacity-0 transition-opacity",
            ])}
          >
            Scanning...
          </div>
        </Link>
      </ContextMenuTrigger>
      <Menu file={file} />
    </ContextMenu>
  );
};

const Menu = ({ file }: { file: TFolder }) => {
  const { names, _id, path } = file;

  const router = useRouter();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { mutate } = use_scan_folders_mutation({
    onSuccess: (data) => {
      if (data.added_files > 0) {
        toast.success(`Added ${data.added_files} new files.`);
      } else {
        toast.message("No new files exist.");
      }

      router.refresh();
    },
  });

  const handleOnScan = () => mutate(path);

  return (
    <ContextMenuContent>
      <ContextMenuLabel className="text-center mb-1">{names[0]}</ContextMenuLabel>
      <ContextMenuSeparator className="h-px bg-accent mb-1"></ContextMenuSeparator>
      <ContextMenuItem>
        <Link href={`/folder/${_id}`}>Open</Link>
      </ContextMenuItem>
      <ContextMenuItem onClick={() => setIsAddOpen(true)}>Add more files</ContextMenuItem>
      <ContextMenuItem onClick={handleOnScan}>Rescan</ContextMenuItem>

      <SidebarFolderControlsAddModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </ContextMenuContent>
  );
};
