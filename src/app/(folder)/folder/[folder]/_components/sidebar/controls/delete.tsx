import { use_delete_folder_mutation } from "@mutations";
import { useFolder } from "@queries";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/ui/form/button";
import { Modal } from "@/ui/modal/modal";

export const FolderSidebarControlDelete = () => {
  const router = useRouter();
  const { data: folder } = useFolder();
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isPending } = use_delete_folder_mutation({
    onSuccess: () => {
      router.replace("/");
      toast.success(`${folder?.names[0]} successfuly deleted.`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleOnDelete = () => {
    setIsOpen(false);
    mutate({ id: folder._id, path: folder.path });
  };

  return (
    <>
      <Button
        variant="red"
        className="w-full h-[38px] py-0 text-[16px] "
        style={{ gridColumn: "1 / 3" }}
        onClick={() => setIsOpen(true)}
        loading={isPending}
        disabled={isPending}
      >
        Delete
      </Button>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        dialogProps={{ className: "max-w-[420px]! py-10" }}
      >
        <div className="text-center">
          <p className="text-xl">
            Are you sure want to do delete{" "}
            <span className="font-medium text-yellow-500">{folder.names[0]}</span>?
          </p>
          <p className="text-white/60 mb-10">This action cannot be undone.</p>
          <Button variant="red" className="w-full h-[38px] p-0" onClick={handleOnDelete}>
            Yes, delete
          </Button>
        </div>
      </Modal>
    </>
  );
};
