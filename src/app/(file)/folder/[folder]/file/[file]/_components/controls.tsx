"use client";

import { useFile, useFolder } from "@queries";
import { ChevronLeft, ChevronRight, LucideIcon } from "lucide-react";
import Link from "next/link";
import { EventBus } from "@/lib/event-bus";
import { cn } from "@/lib/utils";

export const FileControls = () => {
  const { data: folder } = useFolder();
  const { data: file } = useFile();

  const prev = file.prev ? `/folder/${folder._id}/file/${file.prev}` : null;
  const next = file.next ? `/folder/${folder._id}/file/${file.next}` : null;

  return (
    <>
      <Control href={prev} Icon={ChevronLeft} placement="left" />
      <Control href={next} Icon={ChevronRight} placement="right" />
    </>
  );
};

const Control = ({
  href,
  Icon,
  placement,
}: {
  href: string | null;
  Icon: LucideIcon;
  placement: "left" | "right";
}) => {
  if (!href) return;

  const handleOnClick = () => EventBus.emit("navigated-to-sibling-file");

  return (
    <Link
      href={href}
      replace
      data-placement={placement}
      onClick={handleOnClick}
      className={cn([
        "absolute top-[50%] translate-y-[-50%] rounded-full bg-accent w-[38px] h-[38px] flex items-center justify-center opacity-0 transition-all cursor-default hover:shadow-[0px_0px_11px_rgba(170,129,14,0.7)]",
        "opacity-100 pointer-events-auto cursor-pointer",
        `${placement}-2 md:right-4 [&_svg]:relative data-[placement="right"]:[&_svg]:left-0.5 data-[placement="left"]:[&_svg]:right-0.5`,
      ])}
    >
      <Icon className="text-yellow-500" size={30} />
    </Link>
  );
};
