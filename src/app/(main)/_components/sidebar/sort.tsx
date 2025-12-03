import { action_get_many_folders } from "@actions";
import { ArrowDownAZ, Check } from "lucide-react";
import { useQueryParams } from "@/hooks/use-query-params";
import { cn } from "@/lib/utils";
import { SidebarContentWrapper } from "@/ui/layout/sidebar/content-wrapper";
import { useSidebar } from "@/ui/layout/sidebar/sidebar";
import { Command, CommandGroup, CommandItem, CommandList } from "@/ui/ux/command";

type TSort = Parameters<typeof action_get_many_folders>[0]["sort"];

const sorts: Array<{ title: string; value: TSort; cols?: string }> = [
  { value: "popularity", title: "Popularity", cols: "1/3" },
  { value: "name-a-z", title: "Name A-Z" },
  { value: "name-z-a", title: "Name Z-A" },
  { value: "added-recently", title: "Added recently" },
  { value: "added-long-ago", title: "Added long ago" },
  { value: "updated-recently", title: "Updated recently" },
  { value: "updated-long-ago", title: "Updated long ago" },
];

export const HomeSidebarSort = () => {
  const { params, update } = useQueryParams();
  const { isMobile, open } = useSidebar();

  const sort: TSort = (params.get("sort") as TSort) || "popularity";

  return (
    <SidebarContentWrapper Icon={ArrowDownAZ} tooltip="Sort">
      <Command className={!isMobile && open ? "bg-transparent" : ""}>
        <CommandList>
          <CommandGroup>
            {sorts.map((s) => (
              <CommandItem
                key={s.value}
                value={s.value || ""}
                style={{ gridColumn: s.cols || "auto" }}
                onSelect={(val) => update("sort", val)}
                className={cn([
                  "cursor-pointer text-center justify-center rounded-none relative",
                  sort === s.value && "text-yellow-500! bg-accent!",
                  "nth-[2n]:border-r nth-[2n]:border-r-accent",
                  "[&:not(:nth-child(8)):not(:nth-child(9))]:border-b [&:not(:nth-child(8)):not(:nth-child(9))]:border-b-accent",
                ])}
              >
                {s.title}
                <Check
                  className={cn(
                    "ml-auto text-yellow-500 absolute right-2",
                    sort === s.value ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </SidebarContentWrapper>
  );
};
