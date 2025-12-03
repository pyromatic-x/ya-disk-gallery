import { use_update_folder_names_mutation } from "@mutations";
import { useFolder } from "@queries";
import { Plus, Settings } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { QUERY_KEY_FOLDER } from "@/constants/query";
import { get_query_client } from "@/lib/query-client";
import { compareStringArrays } from "@/lib/utils";
import { Button } from "@/ui/form/button";
import { Input } from "@/ui/form/input";
import { Modal } from "@/ui/modal/modal";
import { Badge } from "@/ui/shared/badge";

export const FolderSidebarNamesEdit = () => {
  const { data: folder } = useFolder();
  const [isOpen, setIsOpen] = useState(false);

  const [names, setNames] = useState<Array<string>>([]);
  const [value, setValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const isModified = useMemo(() => {
    return folder?.names && names && !compareStringArrays(folder.names, names);
  }, [folder?.names, names]);

  const { mutate, isPending } = use_update_folder_names_mutation({
    onSuccess: () => {
      get_query_client().invalidateQueries({ queryKey: [QUERY_KEY_FOLDER(folder._id)] });
      setIsOpen(false);
      toast.success("Names successfuly updated.");
    },
  });

  useEffect(() => {
    if (folder?.names) {
      setNames(folder.names);
    }
  }, [folder?.names]);

  const handleOnAdd = () => {
    setNames([...names, value]);
    setValue("");
  };

  const handleOnDelete = (name: string) => {
    const index = names.indexOf(name);
    if (index !== -1) {
      const copy = [...names];
      copy.splice(index, 1);
      setNames(copy);
    }
  };

  const handleOnSave = () => mutate({ folder: folder?._id, names });

  return (
    <>
      <Button
        variant="black"
        size="icon"
        className="h-[22px] w-[22px] absolute -bottom-1 right-1.5"
        onClick={() => setIsOpen(true)}
      >
        <Settings size={14} />
      </Button>

      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="mb-4">
          <p className="mb-3">Names:</p>
          <div className="flex flex-wrap gap-1.5">
            {names.map((name) => (
              <Badge
                className="block select-none aria-pressed:bg-secondary/60 px-3.5"
                key={name}
                deletable={() => handleOnDelete(name)}
              >
                {name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            wrapperClassName="w-full"
            placeholder="New name..."
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

        <Button
          variant="black"
          onClick={handleOnSave}
          loading={isPending}
          disabled={isPending || !isModified}
          className="w-full mt-5 md:mt-0"
        >
          Save
        </Button>
      </Modal>
    </>
  );
};
