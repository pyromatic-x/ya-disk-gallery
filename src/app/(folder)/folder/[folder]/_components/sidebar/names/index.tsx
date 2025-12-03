import { useFolder } from "@queries";
import { BookHeart } from "lucide-react";
import Link from "next/link";
import { SidebarContentWrapper } from "@/ui/layout/sidebar/content-wrapper";
import { FolderSidebarNamesEdit } from "./edit";
import { FolderSidebarNamesBadge } from "./name-badge";

export const FolderSidebarNames = () => {
  const { data: folder } = useFolder();

  return (
    <SidebarContentWrapper Icon={BookHeart} tooltip="Folder names">
      <div className="flex flex-col gap-2">
        <div className="text-2xl font-medium text-center flex items-center justify-center w-full">
          <Link href={`/folder/${folder?._id}`}>{folder?.names[0]}</Link>
        </div>
        <div className="w-full flex flex-wrap gap-1">
          {folder.names.map((t) => (
            <FolderSidebarNamesBadge key={t} value={t} />
          ))}
        </div>

        <FolderSidebarNamesEdit />
      </div>
    </SidebarContentWrapper>
  );
};
