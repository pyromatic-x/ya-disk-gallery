import { use_delete_file_mutation } from "@mutations";
import { useFile, useFolder } from "@queries";
import { SlidersHorizontal } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { QUERY_KEY_FOLDER } from "@/constants/query";
import { EventBus } from "@/lib/event-bus";
import { get_query_client } from "@/lib/query-client";
import { Button } from "@/ui/form/button";
import { SidebarContentWrapper } from "@/ui/layout/sidebar/content-wrapper";

export const FileSidebarControls = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const cleanup = EventBus.subscribe("navigated-to-sibling-file", () => {
      setIsLoading(true);
    });

    return () => {
      cleanup();
    };
  });

  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, []);

  return (
    <SidebarContentWrapper Icon={SlidersHorizontal} tooltip="Open file">
      <div className="grid grid-cols-1 gap-1.5">
        <Open isLoading={isLoading} />
        <Delete isLoading={isLoading} />
      </div>
    </SidebarContentWrapper>
  );
};

const Open = ({ isLoading }: { isLoading: boolean }) => {
  const { data: file } = useFile();

  const url = `https://disk.pyromatic.ru/proxy/image?url=${encodeURIComponent(file.preview_url as string)}`;

  const openOnGoogle = () => {
    const searchUrl = `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(url)}`;
    window.open(searchUrl, "_blank", "noopener,noreferrer");
  };

  const openOnYandex = () => {
    const searchUrl = `https://yandex.ru/images/search?url=${encodeURIComponent(url)}&rpt=imageview`;
    window.open(searchUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex gap-1 w-full">
      <Button
        variant="secondary"
        className="h-[30px] py-0 w-full"
        onClick={openOnGoogle}
        disabled={isLoading}
      >
        Open in Google
      </Button>
      <Button
        variant="secondary"
        onClick={openOnYandex}
        className="h-[30px] py-0 w-full"
        disabled={isLoading}
      >
        Open in Yandex
      </Button>
    </div>
  );
};

const Delete = ({ isLoading }: { isLoading: boolean }) => {
  const { data: folder } = useFolder();
  const { data: file } = useFile();
  const router = useRouter();

  const { mutateAsync, isPending } = use_delete_file_mutation({
    onSuccess: () => {
      router.replace(`/folder/${folder._id}`);
      get_query_client().invalidateQueries({ queryKey: [QUERY_KEY_FOLDER(String(folder))] });
      toast.success("File successfuly deleted.");
    },
    onError: (error) => {
      toast.error(`Something went wrong: ${error.message}`);
    },
  });

  return (
    <Button
      variant="red"
      className="h-[30px] py-0"
      onClick={() =>
        mutateAsync({ file_id: file._id, folder_id: folder._id, file_path: file.path })
      }
      loading={isPending}
      disabled={isPending || isLoading}
    >
      Delete
    </Button>
  );
};
