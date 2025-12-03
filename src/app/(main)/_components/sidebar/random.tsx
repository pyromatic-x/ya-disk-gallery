import { use_get_random_file_mutation, use_get_random_folder_mutation } from "@mutations";
import { Dices } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { Button } from "@/ui/form/button";
import { SidebarContentWrapper } from "@/ui/layout/sidebar/content-wrapper";

export const HomeSidebarRandom = () => {
  const router = useRouter();

  const { mutate: getRandomFolder, isPending: isFolderPending } = use_get_random_folder_mutation({
    onSuccess: (id) => {
      router.push(`/folder/${id}`);
    },
  });

  const { mutate: getRandomFile, isPending: isFilePending } = use_get_random_file_mutation({
    onSuccess: ({ folder, file }) => {
      router.push(`/folder/${folder}/file/${file}`);
    },
  });

  const isPending = isFolderPending || isFilePending;

  return (
    <SidebarContentWrapper Icon={Dices} tooltip="Randoms">
      <div className="w-full flex gap-2 text-[15px]">
        <Button
          variant="secondary"
          className="w-full h-8 py-0"
          onClick={() => getRandomFolder()}
          disabled={isPending}
          loading={isPending}
        >
          Random Folder
        </Button>
        <Button
          variant="secondary"
          className="w-full h-8 py-0"
          onClick={() => getRandomFile()}
          disabled={isPending}
          loading={isPending}
        >
          Random File
        </Button>
      </div>
    </SidebarContentWrapper>
  );
};
