import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/ui/shared/badge";

export const FolderSidebarNamesBadge = ({ value }: { value: string }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [val, setVal] = useState(value);

  const handle_on_click = () => {
    setIsClicked(true);
    setVal("Copied!");

    navigator.clipboard.writeText(value);

    setTimeout(() => {
      setIsClicked(false);
      setVal(value);
    }, 700);
  };

  return (
    <Badge
      className={cn([
        "select-none transition cursor-copy",
        isClicked && "bg-black/70 scale-[0.975]",
      ])}
      onClick={handle_on_click}
    >
      <span className="absolute">{val}</span>
      <span className="opacity-0 pointer-none">{value}</span>
    </Badge>
  );
};
