"use client";

import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { use_rearrange_files_mutation } from "@mutations";
import { useRouter } from "nextjs-toploader/app";
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";
import { useFolder } from "@/hooks/query";
import { TFile } from "@/lib/database/schemas";
import { arraySwap } from "@/lib/utils";
import { FileCard } from "./file-card";
import { FileCardOverlay } from "./overlay";

type TElement = { _id: string; index: number; picture_url: string };

export const FolderPageGrid = () => {
  const { data: folder } = useFolder();
  const [files, setFiles] = useState(folder.files);
  const [active, setActive] = useState<TElement | null>(null);

  const from = useRef<TElement | null>(null);
  const to = useRef<TElement | null>(null);

  useEffect(() => {
    setFiles(folder.files);
  }, [folder.files]);

  const { start, over, end } = handlers({ from, to, setActive, setFiles });

  if (!files.length) return <Empty />;

  return (
    <DragDropProvider onDragEnd={end} onDragOver={over} onDragStart={start}>
      <div
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-0.5 w-full relative"
        style={{ gridAutoRows: "max-content" }}
      >
        {files.map((file, index) => (
          <FileCard key={file._id} index={index} dragging_id={active?._id} file={file} />
        ))}
      </div>
      <DragOverlay>{active ? <FileCardOverlay url={active.picture_url} /> : null}</DragOverlay>
    </DragDropProvider>
  );
};

const handlers = ({
  from,
  to,
  setActive,
  setFiles,
}: {
  from: RefObject<TElement | null>;
  to: RefObject<TElement | null>;
  setActive: (active: TElement | null) => void;
  setFiles: Dispatch<SetStateAction<TFile[]>>;
}) => {
  const router = useRouter();

  const { mutate } = use_rearrange_files_mutation({
    onError: (error) => {
      toast.error(`Failed to save files placement: ${error.message}`);
      toast.info(`The page will be refreshed.`);
      router.refresh();
    },
  });

  const saveDebounced = useDebounceCallback(
    (files: Array<{ id: string; index: number }>) => mutate({ files }),
    5000,
    { trailing: true },
  );

  const save = useCallback(saveDebounced, []);

  const handleOnDragEnd: React.ComponentProps<typeof DragDropProvider>["onDragEnd"] = (event) => {
    setActive(null);

    if (
      event.operation.canceled ||
      !from.current ||
      !to.current ||
      from.current?._id === to.current?._id
    )
      return;

    setFiles((state) => {
      if (from.current && to.current) {
        const swapped = arraySwap(state, from.current.index, to.current.index);

        save(swapped.map((t, i) => ({ id: t._id, index: i })));
        return swapped;
      }
      return state;
    });
  };

  const handleOnDragOver: React.ComponentProps<typeof DragDropProvider>["onDragOver"] = (event) => {
    const operation = event.operation;

    if (operation.canceled) return;

    const source = operation.source?.data as TElement;
    const target = operation.target?.data as TElement;

    from.current = source;
    to.current = target;
  };

  const handleOnDragStart: React.ComponentProps<typeof DragDropProvider>["onDragStart"] = (
    event,
  ) => {
    const operation = event.operation;

    if (operation.canceled) return;

    setActive(operation.source?.data as TElement);
  };

  return { start: handleOnDragStart, over: handleOnDragOver, end: handleOnDragEnd };
};

const Empty = () => (
  <div className="h-screen w-full flex items-center justify-center text-center">
    <div>
      <p className="text-2xl font-semibold">No files yet</p>
      <p className="text-white/70">Try to rescan or manually add new files</p>
    </div>
  </div>
);
