import { use_upload_files_mutation } from "@mutations";
import { useFolder } from "@queries";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { QUERY_KEY_FOLDER } from "@/constants/query";
import { useDevice } from "@/hooks/use-device";
import { get_query_client } from "@/lib/query-client";
import { Button } from "@/ui/form/button";
import { Input } from "@/ui/form/input";
import { Modal } from "@/ui/modal/modal";

interface TProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TFile {
  file: File;
  url: string;
}

export const SidebarFolderControlsAddModal = ({ isOpen, onClose }: TProps) => {
  const { data: folder } = useFolder();
  const { isMobile } = useDevice();
  const [linkValue, setLinkValue] = useState("");
  const [files, setFiles] = useState<Array<TFile>>([]);

  const onDrop = useCallback(async (accepted_files: Array<File>) => {
    const items = (await Promise.all(
      accepted_files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                file,
                url: reader.result,
              });
            reader.onerror = reject;
            reader.readAsDataURL(file);
          }),
      ),
    )) as Array<TFile>;

    setFiles(items);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const { mutateAsync, isPending } = use_upload_files_mutation({
    onSuccess: ({ added, errors }) => {
      get_query_client().invalidateQueries({ queryKey: [QUERY_KEY_FOLDER(folder._id)] });
      toast(
        <div>
          <p>
            Added files: <span className="text-green-400">{added}</span>
          </p>
          <p>
            Failed to upload: <span className="text-red-400">{errors}</span>
          </p>
        </div>,
      );
      onClose();
    },
    onSettled: () => {
      setFiles([]);
      setLinkValue("");
    },
  });

  const handleOnProceed = () => {
    if (linkValue) {
      mutateAsync({ source: linkValue, path: folder.path });
    } else if (files.length) {
      mutateAsync({ source: files.map((t) => t.file), path: folder.path });
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="mt-4">
        <p className="text-center mb-5">Add files</p>
        {!linkValue && (
          <div className="w-full h-40 mb-6" {...getRootProps()}>
            {!files.length ? (
              <>
                <Input {...getInputProps()} />
                <div className="w-full h-full rounded-[12px] border-2 border-white/30 border-dashed flex items-center justify-center">
                  <p>{isMobile ? "Choose files" : "Drop files here"}</p>
                </div>
              </>
            ) : (
              <div className="flex gap-1 overflow-scroll h-full">
                {files.map((f) => (
                  <Image
                    key={f.file.name}
                    src={f.url}
                    alt={f.file.name}
                    width={250}
                    height={250}
                    className="block h-full w-max aspect-square object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {!files.length && (
          <div className="mb-4">
            {!linkValue && (
              <p className="text-sm text-white/80 mb-2">
                Or paste image/video url from around the internet
              </p>
            )}
            <Input
              value={linkValue}
              onChange={(e) => setLinkValue(e.target.value)}
              className="w-full"
              placeholder="URL..."
            />
          </div>
        )}

        <Button
          className="w-full"
          disabled={!linkValue && !files.length}
          loading={isPending}
          onClick={handleOnProceed}
        >
          Proceed
        </Button>
      </div>
    </Modal>
  );
};
