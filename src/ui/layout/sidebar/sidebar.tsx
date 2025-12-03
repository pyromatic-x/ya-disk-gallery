"use client";

import * as React from "react";
import { useDevice } from "@/hooks/use-device";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/form/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/ui/layout/sheet";
import { TooltipProvider } from "@/ui/shared/tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "400px";
const SIDEBAR_WIDTH_MOBILE = "85vw";
const SIDEBAR_WIDTH_ICON = "60px";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type TSidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<TSidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { isMobile } = useDevice();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // biome-ignore lint/suspicious/noDocumentCookie: This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed";

  // biome-ignore lint/correctness/useExhaustiveDependencies: skip
  const contextValue = React.useMemo<TSidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="bg-background text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden border-black"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className="group peer text-sidebar-foreground hidden md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
        )}
      />
      <div
        data-slot="sidebar-container"
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className,
          "border-black",
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarTrigger({
  className,
  onClick,
  branded = false,
  ...props
}: React.ComponentProps<typeof Button> & { branded?: boolean }) {
  const { toggleSidebar } = useSidebar();

  const handleOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    toggleSidebar();
  };

  return (
    <Button
      variant="black"
      size="icon"
      onClick={handleOnClick}
      {...props}
      className={cn(["shadow", className])}
    >
      <svg
        width="18"
        height="14"
        viewBox="0 0 18 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-yellow-500!"
      >
        <title>sidebar icon</title>
        <path
          opacity="0.7"
          d="M6.14941 12.4785V1.67773H7.22266V12.4785H6.14941ZM3.8252 13.3604C2.90462 13.3604 2.19368 13.1097 1.69238 12.6084C1.19108 12.1071 0.94043 11.3962 0.94043 10.4756V3.66699C0.94043 2.74642 1.19108 2.03548 1.69238 1.53418C2.19368 1.02832 2.90462 0.775391 3.8252 0.775391H14.3457C15.207 0.775391 15.8747 1.02832 16.3486 1.53418C16.8226 2.03548 17.0596 2.74642 17.0596 3.66699V10.4756C17.0596 11.3962 16.8226 12.1071 16.3486 12.6084C15.8747 13.1097 15.207 13.3604 14.3457 13.3604H3.8252ZM3.83203 12.2598H14.168C14.7376 12.2598 15.1774 12.1048 15.4873 11.7949C15.8018 11.4805 15.959 11.0407 15.959 10.4756V3.66699C15.959 3.10189 15.8018 2.66211 15.4873 2.34766C15.1774 2.0332 14.7376 1.87598 14.168 1.87598H3.83203C3.26237 1.87598 2.82031 2.0332 2.50586 2.34766C2.19596 2.66211 2.04102 3.10189 2.04102 3.66699V10.4756C2.04102 11.0407 2.19596 11.4805 2.50586 11.7949C2.82031 12.1048 3.26237 12.2598 3.83203 12.2598ZM4.83691 4.41895H3.36719C3.26693 4.41895 3.17806 4.38021 3.10059 4.30273C3.02311 4.2207 2.98438 4.13184 2.98438 4.03613C2.98438 3.93132 3.02311 3.84245 3.10059 3.76953C3.17806 3.69206 3.26693 3.65332 3.36719 3.65332H4.83691C4.93717 3.65332 5.02604 3.69206 5.10352 3.76953C5.18555 3.84245 5.22656 3.93132 5.22656 4.03613C5.22656 4.13184 5.18555 4.2207 5.10352 4.30273C5.02604 4.38021 4.93717 4.41895 4.83691 4.41895ZM4.83691 6.18945H3.36719C3.26693 6.18945 3.17806 6.15072 3.10059 6.07324C3.02311 5.99577 2.98438 5.90462 2.98438 5.7998C2.98438 5.69954 3.02311 5.61296 3.10059 5.54004C3.17806 5.46257 3.26693 5.42383 3.36719 5.42383H4.83691C4.93717 5.42383 5.02604 5.46257 5.10352 5.54004C5.18555 5.61296 5.22656 5.69954 5.22656 5.7998C5.22656 5.90462 5.18555 5.99577 5.10352 6.07324C5.02604 6.15072 4.93717 6.18945 4.83691 6.18945ZM4.83691 7.95312H3.36719C3.26693 7.95312 3.17806 7.91667 3.10059 7.84375C3.02311 7.76628 2.98438 7.67741 2.98438 7.57715C2.98438 7.47233 3.02311 7.38346 3.10059 7.31055C3.17806 7.23307 3.26693 7.19434 3.36719 7.19434H4.83691C4.93717 7.19434 5.02604 7.23307 5.10352 7.31055C5.18555 7.38346 5.22656 7.47233 5.22656 7.57715C5.22656 7.67741 5.18555 7.76628 5.10352 7.84375C5.02604 7.91667 4.93717 7.95312 4.83691 7.95312Z"
          fill="currentColor"
        />
      </svg>
    </Button>
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2 py-4", className)}
      {...props}
    />
  );
}

function SidebarGroupContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
};
