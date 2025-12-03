import { useTags } from "@queries";
import { Settings, Tag, X } from "lucide-react";
import { useState } from "react";
import { useQueryParams } from "@/hooks/use-query-params";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/form/button";
import { SidebarContentWrapper } from "@/ui/layout/sidebar/content-wrapper";
import { Badge } from "@/ui/shared/badge";
import { HomeSidebarTagsModal } from "./modal";

export const HomeSidebarTags = () => {
  const { params, update, remove } = useQueryParams();
  const { data: tags } = useTags();

  const selectedTags = params.get("tags")?.split(",");

  const [isOpen, setIsOpen] = useState(false);

  const handleOnChange = (tag: string) => {
    const _tags = params.getAll("tags");

    if (_tags.includes(tag)) {
      const index = _tags.indexOf(tag);

      if (index !== -1) {
        _tags.splice(index, 1);
      }
    } else {
      _tags.push(tag);
    }

    update("tags", _tags.toString());
  };

  return (
    <SidebarContentWrapper Icon={Tag} tooltip="Tags">
      <div className="flex flex-wrap gap-1.5">
        {tags?.map((tag) => (
          <Badge
            key={tag._id}
            className="cursor-pointer text-sm"
            variant={selectedTags?.includes(tag._id) ? "primary" : "secondary"}
            onClick={() => handleOnChange(tag._id)}
          >
            {tag.value}
          </Badge>
        ))}

        {Boolean(selectedTags?.length) && (
          <Button
            variant="black"
            size="icon"
            className={cn([
              "h-[22px] w-[22px] opacity-0 transition",
              Boolean(tags.length) && "opacity-100",
            ])}
            onClick={() => remove("tags")}
          >
            <X size={14} />
          </Button>
        )}

        <Button
          variant="black"
          size="icon"
          className="h-[22px] w-[22px] absolute -bottom-0.5 right-1.5"
          onClick={() => setIsOpen(true)}
        >
          <Settings size={14} />
        </Button>

        <HomeSidebarTagsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </SidebarContentWrapper>
  );
};
