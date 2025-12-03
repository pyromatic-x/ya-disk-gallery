"use client";

import { PropsWithChildren } from "react";
import { SidebarContent } from "@/ui/layout/sidebar/sidebar";
import { SidebarWrapper } from "@/ui/layout/sidebar/sidebar-wrapper";
import { HomeSidebarControls } from "./controls";
import { HomeSidebarRandom } from "./random";
import { HomeSidebarSearch } from "./search";
import { HomeSidebarSort } from "./sort";
import { HomeSidebarTags } from "./tags";

export const HomeSidebar = ({ children }: PropsWithChildren) => {
  return (
    <SidebarWrapper
      content={
        <SidebarContent>
          <HomeSidebarSearch />
          <HomeSidebarTags />
          <HomeSidebarSort />
          <HomeSidebarRandom />
          <HomeSidebarControls />
        </SidebarContent>
      }
    >
      {children}
    </SidebarWrapper>
  );
};
