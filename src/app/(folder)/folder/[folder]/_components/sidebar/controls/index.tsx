import { SlidersHorizontal } from "lucide-react";

import { SidebarContentWrapper } from "@/ui/layout/sidebar/content-wrapper";
import { FolderSidebarControlsAdd } from "./add";
import { FolderSidebarControlDelete } from "./delete";
import { FolderSidebarControlsScan } from "./scan";

export const FolderSidebarControls = () => {
  return (
    <SidebarContentWrapper Icon={SlidersHorizontal} tooltip="Folder controls">
      <div className="grid grid-cols-2 gap-2 w-full">
        <FolderSidebarControlsAdd />
        <FolderSidebarControlsScan />
        <FolderSidebarControlDelete />
      </div>
    </SidebarContentWrapper>
  );
};
