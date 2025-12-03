import { X } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import { useDevice } from "@/hooks/use-device";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form/form";
import { Input } from "@/ui/form/input";
import { TCreateFolderForm } from ".";

export const CreateFolderFormFiles = () => {
  const { control, setValue, getValues } = useFormContext<TCreateFolderForm>();
  const { isMobile } = useDevice();

  const handleOnDrop = useCallback(
    async (acceptedFiles: Array<File>) => {
      const items = (await Promise.all(
        acceptedFiles.map(
          (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () =>
                resolve({
                  file,
                  name: file.name,
                  mime_type: file.type,
                  size: file.size,
                  url: reader.result,
                });
              reader.onerror = reject;
              reader.readAsDataURL(file);
            }),
        ),
      )) as TCreateFolderForm["files"];

      setValue("files", items);
    },
    [setValue],
  );

  const handleOnDelete = (index: number) => {
    const values = getValues("files");

    if (values?.[index]) {
      const copy = [...values];
      copy.splice(index, 1);
      setValue("files", copy);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop: handleOnDrop });

  return (
    <FormField
      control={control}
      name="files"
      render={({ field }) => (
        <FormItem className="h-max">
          <FormLabel>Files</FormLabel>
          <FormControl>
            <div className="w-full mb-6" {...getRootProps()}>
              {!field.value?.length ? (
                <>
                  <Input {...getInputProps()} />
                  <div className="w-full rounded-[12px] border-2 border-white/30 border-dashed flex items-center justify-center mb-5 h-40">
                    <p>{isMobile ? "Choose files" : "Drop files here"}</p>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-6 gap-1">
                  {field.value.map((f, i) => (
                    <div key={f.name} className="relative">
                      <button
                        type="button"
                        className="absolute top-0.5 right-0.5 rounded-full p-1 bg-background z-1 cursor-pointer"
                        onClick={() => handleOnDelete(i)}
                      >
                        <X size={12} />
                      </button>
                      <Image
                        src={f.url}
                        alt={f.name}
                        width={250}
                        height={250}
                        className="block h-full w-max aspect-square object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
