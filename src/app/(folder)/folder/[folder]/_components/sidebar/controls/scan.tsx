import { use_scan_folders_mutation } from "@mutations";
import { useFolder } from "@queries";
import { toast } from "sonner";
import { QUERY_KEY_FOLDER } from "@/constants/query";
import { get_query_client } from "@/lib/query-client";
import { Button } from "@/ui/form/button";

export const FolderSidebarControlsScan = () => {
  const { data: folder } = useFolder();

  const { mutateAsync, isPending } = use_scan_folders_mutation({
    onSuccess: (data) => {
      if (data.added_files > 0) {
        get_query_client().invalidateQueries({ queryKey: [QUERY_KEY_FOLDER(folder._id)] });
        toast.success(`Added ${data.added_files} new files.`);
      } else {
        toast.message("No new files exist.");
      }
    },
  });

  const handleOnScan = () => mutateAsync(folder.path);

  return (
    <Button
      variant="black"
      className="w-full h-[38px] py-0 text-[16px]"
      onClick={handleOnScan}
      loading={isPending}
      disabled={isPending}
    >
      Scan
    </Button>
  );
};
