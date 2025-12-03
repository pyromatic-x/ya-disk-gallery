"use client";

import { FolderSidebarLinks } from "@folder/sidebar/links";
import { FolderSidebarNames } from "@folder/sidebar/names";
import { FolderSidebarPreview } from "@folder/sidebar/preview";
import { FolderSidebarTags } from "@folder/sidebar/tags";
import { PropsWithChildren } from "react";
import { SidebarContent } from "@/ui/layout/sidebar/sidebar";
import { SidebarWrapper } from "@/ui/layout/sidebar/sidebar-wrapper";
import { FileSidebarControls } from "./controls";
import { FileSidebarInfo } from "./info";

export const FileSidebar = ({ children }: PropsWithChildren) => {
  return (
    <SidebarWrapper
      content={
        <SidebarContent>
          <FolderSidebarPreview />
          <FolderSidebarNames />
          <FolderSidebarLinks />
          <FolderSidebarTags />
          <FileSidebarInfo />
          <FileSidebarControls />
        </SidebarContent>
      }
    >
      {children}
    </SidebarWrapper>
  );
};
