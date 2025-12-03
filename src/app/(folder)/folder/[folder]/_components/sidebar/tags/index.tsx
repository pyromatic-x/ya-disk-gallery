import { useFolder, useTags } from "@queries";
import { Settings, Tag } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { Button } from "@/ui/form/button";
import { SidebarContentWrapper } from "@/ui/layout/sidebar/content-wrapper";
import { Badge } from "@/ui/shared/badge";
import { FolderSidebarTagsEdit } from "./edit";

export const FolderSidebarTags = () => {
  const router = useRouter();
  const { data: folder } = useFolder();
  const { data: tags } = useTags();
  const [isOpen, setIsOpen] = useState(false);

  const handleOnSearchTag = (tag: string) => router.push(`/?tags=${tag}`);

  return (
    <SidebarContentWrapper Icon={Tag} tooltip="Folder tags">
      <div className="flex flex-wrap gap-1.5 relative">
        {folder.tags?.length ? (
          folder.tags?.map((tag) => (
            <Badge
              key={tag}
              variant="default"
              className="text-sm cursor-alias"
              onClick={() => handleOnSearchTag(tag)}
            >
              {tags.find((t) => t._id === tag)?.value}
            </Badge>
          ))
        ) : (
          <p>Missing tags</p>
        )}
      </div>

      <Button
        variant="black"
        size="icon"
        className="h-[22px] w-[22px] absolute bottom-0 right-1"
        onClick={() => setIsOpen(true)}
      >
        <Settings size={14} />
      </Button>
      <FolderSidebarTagsEdit isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </SidebarContentWrapper>
  );
};
