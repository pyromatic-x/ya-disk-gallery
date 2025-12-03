import { use_update_tags_mutation } from "@mutations";
import { useTags } from "@queries";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { QUERY_KEY_TAGS } from "@/constants/query";
import { get_query_client } from "@/lib/query-client";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/form/button";
import { Input } from "@/ui/form/input";
import { Modal } from "@/ui/modal/modal";
import { Badge } from "@/ui/shared/badge";

interface TProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HomeSidebarTagsModal = ({ isOpen, onClose }: TProps) => {
  const { data } = useTags();

  const [tags, setTags] = useState<Array<string>>(data.map((t) => t.value));
  const [value, setValue] = useState("");

  const { mutateAsync, isPending } = use_update_tags_mutation({
    onSuccess: () => {
      get_query_client().invalidateQueries({ queryKey: [QUERY_KEY_TAGS] });
      toast.success("Tags successfuly updated.");
      onClose();
    },
  });

  const handleOnAdd = () => {
    setTags([...tags, value]);
    setValue("");
  };

  const handleOnDelete = (id: string) => {
    const index = tags.indexOf(id);
    if (index !== -1) {
      const copy = [...tags];
      copy.splice(index, 1);
      setTags(copy);
    }
  };

  const onSave = () => {
    const dataValues = data.map((t) => t.value);

    const added = tags.filter((t) => !dataValues.includes(t));
    const deleted = data.filter((t) => !tags.includes(t.value)).map((t) => t._id);

    mutateAsync({ added, deleted });
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="mb-4">
        <p className="mb-3">Tags:</p>
        <div className="flex flex-wrap gap-1.5 mb-8">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className={cn([
                "text-sm cursor-pointer",
                !data?.map((t) => t.value).includes(tag) && "bg-green-400 text-black",
              ])}
              deletable={() => handleOnDelete(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            wrapperClassName="w-full"
            placeholder="New tag..."
            autoFocus
          />
          <Button
            disabled={!value}
            onClick={handleOnAdd}
            className="h-[38px] py-0"
            variant="secondary"
          >
            <Plus size={18} />
          </Button>
        </div>
      </div>

      <Button
        variant="black"
        onClick={onSave}
        loading={isPending}
        className="w-full"
        disabled={isPending}
      >
        Save
      </Button>
    </Modal>
  );
};
