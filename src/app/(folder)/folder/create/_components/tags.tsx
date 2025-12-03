"use client";

import { useTags } from "@queries";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form/form";
import { Badge } from "@/ui/shared/badge";
import { TCreateFolderForm } from ".";

export const CreateFolderFormTags = () => {
  const { data: tags } = useTags();
  const { control } = useFormContext<TCreateFolderForm>();

  return (
    <FormField
      control={control}
      name="tags"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tags</FormLabel>
          <FormControl>
            <div className="flex flex-wrap gap-1">
              {tags?.map((tag) => (
                <Badge
                  key={tag._id}
                  variant={field.value?.includes(tag._id) ? "default" : "secondary"}
                  className={cn([
                    "text-sm cursor-pointer",
                    field.value?.includes(tag._id)
                      ? " hover:bg-primary/85 "
                      : "hover:bg-secondary/85",
                  ])}
                  onClick={() => {
                    const copy = field.value || [];
                    const isPicked = copy.includes(tag._id);

                    if (!isPicked) {
                      field.onChange([...copy, tag._id]);
                    } else {
                      const index = copy.indexOf(tag._id);

                      if (index !== -1) {
                        copy.splice(index, 1);
                        field.onChange(copy);
                      }
                    }
                  }}
                >
                  {tag.value}
                </Badge>
              ))}
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
