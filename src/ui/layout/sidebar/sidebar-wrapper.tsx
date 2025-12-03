"use client";

import { JSX, PropsWithChildren } from "react";
import { Sidebar, SidebarProvider } from "@/ui/layout/sidebar/sidebar";

import { AppSidebarHeader } from "./header";
import { SidebarMobileTrigger } from "./mobile-trigger";

interface TProps extends PropsWithChildren {
  content: JSX.Element;
}

export const SidebarWrapper = ({ children, content }: TProps) => {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <AppSidebarHeader />
        {content}
      </Sidebar>
      <SidebarMobileTrigger />
      {children}
    </SidebarProvider>
  );
};
