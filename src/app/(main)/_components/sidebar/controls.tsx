import { use_scan_folders_mutation } from "@mutations";
import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/ui/form/button";
import { SidebarContentWrapper } from "@/ui/layout/sidebar/content-wrapper";

export const HomeSidebarControls = () => {
  const { mutate, isPending } = use_scan_folders_mutation({
    onSuccess: (counts) => {
      toast.message(
        <div className="flex flex-col gap-1 text-base [&_span]:text-yellow-500">
          <p>
            Scanned folders: <span>{counts.scanned_folders}</span>
          </p>
          <p>
            Added folders: <span>{counts.created_folders}</span>
          </p>
          <p>
            Updated folders: <span>{counts.updated_folders}</span>
          </p>
          <p>
            Added files: <span>{counts.added_files}</span>
          </p>
        </div>,
        {
          duration: Infinity,
        },
      );
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <SidebarContentWrapper Icon={SlidersHorizontal} tooltip="Controls">
      <div className="grid grid-cols-2 gap-2">
        <Link href="/folder/create" className="w-full">
          <Button variant="black" className="w-full h-[38px] py-0 text-[16px]">
            Add new folder
          </Button>
        </Link>
        <Button
          variant="black"
          className="w-full h-[38px] py-0 text-[16px]"
          onClick={() => mutate("")}
          loading={isPending}
          disabled={isPending}
        >
          Scan
        </Button>
        <Link href="/charts" className="w-full" style={{ gridColumn: "1 / 3" }}>
          <Button variant="black" className="w-full h-[38px] py-0 text-[16px]">
            Charts
          </Button>
        </Link>
      </div>
    </SidebarContentWrapper>
  );
};
