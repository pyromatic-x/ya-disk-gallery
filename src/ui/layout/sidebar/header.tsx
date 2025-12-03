"use client";
import { Flame } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/ui/form/button";
import { SidebarHeader, useSidebar } from "@/ui/layout/sidebar/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/shared/tooltip";

export const AppSidebarHeader = () => {
  const { open, isMobile, toggleSidebar } = useSidebar();

  const handleOnClick = () => toggleSidebar();

  return (
    <>
      <SidebarHeader>
        <div className="h-[38px] flex w-full items-center justify-center relative">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="transparent"
                size="icon"
                className={cn(["absolute transition-all left-0.5 z-10", "text-yellow-500"])}
                onClick={handleOnClick}
              >
                <Flame />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Toggle Sidebar</TooltipContent>
          </Tooltip>
          <Link href="/">
            <p
              className={cn([
                "pl-3 font-medium text-yellow-500 relative top-0.5 transition-all w-full text-center",
                !open && !isMobile && "opacity-0 w-[0%]",
              ])}
            >
              hiddenfolder
            </p>
          </Link>
        </div>
      </SidebarHeader>
      <div className={cn(["w-full h-px bg-accent"])} />
    </>
  );
};
