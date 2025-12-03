"use client";

import { PropsWithChildren } from "react";
import { SidebarContent } from "@/ui/layout/sidebar/sidebar";
import { SidebarWrapper } from "@/ui/layout/sidebar/sidebar-wrapper";
import { FolderSidebarControls } from "./controls";
import { FolderSidebarInfo } from "./info";
import { FolderSidebarLinks } from "./links";
import { FolderSidebarNames } from "./names";
import { FolderSidebarPreview } from "./preview";
import { FolderSidebarTags } from "./tags";

export const FolderSidebar = ({ children }: PropsWithChildren) => {
  return (
    <SidebarWrapper
      content={
        <SidebarContent>
          <FolderSidebarPreview />
          <FolderSidebarNames />
          <FolderSidebarLinks />
          <FolderSidebarTags />
          <FolderSidebarInfo />
          <FolderSidebarControls />
        </SidebarContent>
      }
    >
      {children}
    </SidebarWrapper>
  );
};
