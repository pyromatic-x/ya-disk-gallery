import { use_update_folder_tags_mutation } from "@mutations";
import { useFolder, useTags } from "@queries";
import { useMemo, useState } from "react";
import { QUERY_KEY_FOLDER, QUERY_KEY_TAGS } from "@/constants/query";
import { get_query_client } from "@/lib/query-client";
import { cn, compareStringArrays } from "@/lib/utils";
import { Button } from "@/ui/form/button";
import { Modal } from "@/ui/modal/modal";
import { Badge } from "@/ui/shared/badge";

export const FolderSidebarTagsEdit = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { data: folder } = useFolder();
  const { data: tagsData } = useTags();

  const [tags, setTags] = useState<Array<string>>(folder.tags);

  const { mutate, isPending } = use_update_folder_tags_mutation({
    onSuccess: () => {
      onClose();
      get_query_client().invalidateQueries({
        queryKey: [QUERY_KEY_TAGS, QUERY_KEY_FOLDER(folder._id)],
      });
    },
  });

  const isModified = useMemo(() => {
    return folder.tags.length && tags.length && !compareStringArrays(folder.tags, tags);
  }, [folder?.tags, tags]);

  const handleOnClick = (tag: string) => {
    const isApplied = tags.includes(tag);
    if (isApplied) {
      const index = tags.indexOf(tag);

      if (index !== -1) {
        const copy = [...tags];
        copy.splice(index, 1);
        setTags(copy);
      }
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleOnSave = () => mutate({ folder: folder._id, tags });

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="mb-4">
        <p className="mb-3">Tags:</p>
        <div className="flex flex-wrap gap-1.5">
          {tagsData.map((tag) => (
            <Badge
              key={tag._id}
              variant={tags?.includes(tag._id) ? "default" : "secondary"}
              className={cn([
                "text-sm cursor-pointer",
                tags.includes(tag._id) ? " hover:bg-primary/85 " : "hover:bg-secondary/85",
              ])}
              onClick={() => handleOnClick(tag._id)}
            >
              {tag.value}
            </Badge>
          ))}
        </div>
      </div>

      <Button
        variant="black"
        disabled={!isModified}
        onClick={handleOnSave}
        loading={isPending}
        className="w-full mt-5 md:mt-0"
      >
        Save
      </Button>
    </Modal>
  );
};
