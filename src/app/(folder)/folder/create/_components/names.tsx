"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/ui/form/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form/form";
import { Input } from "@/ui/form/input";
import { Badge } from "@/ui/shared/badge";
import { TCreateFolderForm } from ".";

export const CreateFolderFormNames = () => {
  const { control } = useFormContext<TCreateFolderForm>();

  const [inputValue, setInputValue] = useState("");

  return (
    <FormField
      control={control}
      name="names"
      render={({ field }) => (
        <FormItem className="h-max">
          <FormLabel>Names</FormLabel>
          <FormControl>
            <div>
              <div className="flex items-center gap-2 w-full mb-1">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a name..."
                  type="text"
                  wrapperClassName="w-full"
                />
                <Button
                  className="h-[38px] py-0"
                  disabled={!inputValue}
                  onClick={() => {
                    field.onChange([...(field.value || []), inputValue]);
                    setInputValue("");
                  }}
                >
                  <Plus />
                </Button>
              </div>
              {Boolean(field?.value?.length) && (
                <div className="flex flex-wrap gap-1">
                  {field.value.map((t) => (
                    <Badge
                      key={t}
                      deletable={() => {
                        const copy = field.value || [];
                        const index = copy.indexOf(t);

                        if (index !== -1) {
                          copy.splice(index, 1);
                          field.onChange(copy);
                        }
                      }}
                    >
                      {t}
                    </Badge>
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
