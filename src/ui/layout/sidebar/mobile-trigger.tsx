import { SidebarTrigger, useSidebar } from "./sidebar";

export const SidebarMobileTrigger = () => {
  const { isMobile } = useSidebar();

  if (!isMobile) return;

  return <SidebarTrigger className="fixed top-3 left-3 [&_svg]:text-white z-1" />;
};
