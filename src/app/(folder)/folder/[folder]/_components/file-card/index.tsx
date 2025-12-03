"use client";

import { CollisionPriority } from "@dnd-kit/abstract";
import { DragDropProvider, useDraggable, useDroppable } from "@dnd-kit/react";
import { TFile } from "@schemas";
import { SquarePlay } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/ui/shared/spinner";
import { ContextMenu, ContextMenuTrigger } from "@/ui/ux/context-menu";
import { FileCardMenu } from "./menu";

interface TProps {
  index: number;
  dragging_id?: string;
  file: TFile;
}

export const FileCard = ({ index, dragging_id, file }: TProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);

  const src = `/proxy/image?url=${encodeURIComponent(file.preview_url)}`;

  const { ref: droppableRef, isDropTarget } = useDroppable({
    id: `${file._id}-droppable`,
    accept: "file",
    data: { _id: file._id, index, picture_url: file.preview_url },
    collisionPriority: CollisionPriority.Highest,
  });

  const { ref: draggableRef, isDragging } = useDraggable({
    id: `${file._id}-draggable`,
    type: "file",
    data: { _id: file._id, index, picture_url: file.preview_url },
  });

  const checkIsCached = useCallback(() => {
    if (imageRef.current) {
      const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
      const host = `${protocol}://${window.location.hostname}`;

      const entries = performance.getEntriesByName(`${host}${src}`);

      if (entries.length > 0) {
        const entry = entries[0] as PerformanceResourceTiming;
        const cached = entry.transferSize === 0 || entry.transferSize < 1000;

        if (cached) return true;
      }
    }

    return false;
  }, [src]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: on mount
  useEffect(() => {
    setIsLoading(!checkIsCached());
  }, []);

  return (
    <ContextMenu>
      <DragDropProvider>
        <ContextMenuTrigger
          ref={droppableRef}
          className={cn([
            "transition-all bg-transparent",
            dragging_id && dragging_id !== file._id && "scale-95",
            isDropTarget && "scale-100",
          ])}
        >
          <Link
            ref={draggableRef}
            href={`/folder/${file.folder}/file/${file._id}`}
            className="block relative overflow-hidden hover:[&_img]:scale-[1.15] aspect-square"
          >
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
              <Spinner className={cn(["transition-opacity", !isLoading && "opacity-0"])} />
            </div>
            <Image
              ref={imageRef}
              unoptimized={true}
              src={src}
              alt={file.name || ""}
              width={200}
              height={200}
              className={cn([
                `aspect-square object-cover w-full h-full transition-all`,
                file.media_type === "video" && "brightness-35",
                isLoading && "opacity-0",
                isDragging && "opacity-15",
              ])}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.jpg";
              }}
              onLoad={() => setIsLoading(false)}
            />
            {file.media_type === "video" && (
              <SquarePlay
                size={42}
                className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
              />
            )}
          </Link>
        </ContextMenuTrigger>
      </DragDropProvider>
      <FileCardMenu {...file} />
    </ContextMenu>
  );
};
