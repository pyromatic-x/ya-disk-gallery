import { useState } from "react";
import { Button } from "@/ui/form/button";
import { SidebarFolderControlsAddModal } from "./add-modal";

export const FolderSidebarControlsAdd = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="black"
        className="w-full h-[38px] py-0 text-[16px]"
        onClick={() => setIsOpen(true)}
      >
        Add files
      </Button>

      <SidebarFolderControlsAddModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
