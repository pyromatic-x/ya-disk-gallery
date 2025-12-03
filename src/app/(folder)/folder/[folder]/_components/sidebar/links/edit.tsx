import { use_update_folder_links_mutation } from "@mutations";
import { useFolder } from "@queries";
import { Plus, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { QUERY_KEY_FOLDER } from "@/constants/query";
import { get_query_client } from "@/lib/query-client";
import { compareStringArrays } from "@/lib/utils";
import { Button } from "@/ui/form/button";
import { Input } from "@/ui/form/input";
import { Modal } from "@/ui/modal/modal";

export const FolderSidebarLinksEdit = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { data: folder } = useFolder();
  const [links, setLinks] = useState<Array<string>>([]);
  const [value, setValue] = useState("");

  const input_ref = useRef<HTMLInputElement>(null);

  const isModified = useMemo(
    () => folder.links && links && !compareStringArrays(folder.links, links),
    [folder, links],
  );

  useEffect(() => {
    if (folder?.links) {
      setLinks(folder.links);
    }
  }, [folder?.links]);

  const { mutate, isPending } = use_update_folder_links_mutation({
    onSuccess: () => {
      toast.success("Links successfuly updated.");
      onClose();
      get_query_client().invalidateQueries({ queryKey: [QUERY_KEY_FOLDER(folder._id)] });
    },
  });

  const handleOnAdd = () => {
    setLinks([...links, value]);
    setValue("");
  };

  const handleOnDelete = (id: string) => {
    const index = links.indexOf(id);
    if (index !== -1) {
      const copy = [...links];
      copy.splice(index, 1);
      setLinks(copy);
    }
  };

  const handleOnSave = () => mutate({ folder: folder._id, links });

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="mb-4">
        <p className="mb-3">Links:</p>
        <div className="flex flex-col gap-1.5">
          {links.map((link) => (
            <div key={link} className="flex items-center gap-1.5">
              <Link href={link} target="_blank" className="text-sm hover:underline text-blue-300">
                {link}
              </Link>
              <button
                type="button"
                className=" rounded-full bg-black p-0.5 cursor-pointer"
                onClick={() => handleOnDelete(link)}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Input
          ref={input_ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          wrapperClassName="w-full"
          placeholder="New link..."
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
        disabled={isPending || !isModified || Boolean(value)}
        className="w-full mt-5 md:mt-0"
      >
        Save
      </Button>
    </Modal>
  );
};
