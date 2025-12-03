import { LucideProps } from "lucide-react";
import {
  ComponentProps,
  ForwardRefExoticComponent,
  PropsWithChildren,
  RefAttributes,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/form/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/shared/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/ux/popover";
import { SidebarGroup, SidebarGroupContent, useSidebar } from "./sidebar";

type TProps = {
  Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  tooltip: string;
} & PropsWithChildren &
  ComponentProps<"div">;

export const SidebarContentWrapper = ({ Icon, children, className, tooltip, ...rest }: TProps) => {
  const { isMobile, open } = useSidebar();

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <>
      <SidebarGroup className={cn([open ? "px-5.5" : "", className])} {...rest}>
        <SidebarGroupContent>
          {!isMobile && !open ? (
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <div className="w-full flex justify-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" aria-expanded={isPopoverOpen}>
                        <Icon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">{tooltip}</TooltipContent>
                  </Tooltip>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-max max-w-[340px]">{children}</PopoverContent>
            </Popover>
          ) : (
            children
          )}
        </SidebarGroupContent>
      </SidebarGroup>
      <div className={cn(["w-full h-px bg-accent"])} />
    </>
  );
};
