import { useCounts } from "@queries";
import { Search, Search as SearchIcon, X } from "lucide-react";
import { useState } from "react";
import { useQueryParams } from "@/hooks/use-query-params";
import { Button } from "@/ui/form/button";
import { Input } from "@/ui/form/input";
import { SidebarContentWrapper } from "@/ui/layout/sidebar/content-wrapper";

export const HomeSidebarSearch = () => {
  const { data: counts } = useCounts();

  const { params, update, remove } = useQueryParams();
  const [value, setValue] = useState(params.get("search") || "");

  const handleOnSearch = () => update("search", value);
  const handleOnClear = () => {
    if (params.get("search")) remove("search");

    setValue("");
  };

  return (
    <SidebarContentWrapper Icon={SearchIcon} tooltip="Search">
      <div className="relative">
        <p className="text-center text-[16px] mb-4">
          Search by name among
          <br />
          <span className="font-medium text-yellow-500">{counts.folders} folders</span> and{" "}
          <span className="font-medium text-yellow-500">{counts.files} files</span>
        </p>
        <div className="flex flex-row gap-2">
          <div className="relative w-full">
            <Input
              value={value}
              placeholder="Start typing a name..."
              className="pr-9"
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && value) handleOnSearch();
              }}
            />
            {(value || params.get("search")) && (
              <Button
                className="absolute right-1 bottom-1 text-white/50 h-[30px] w-[30px]"
                size="icon"
                onClick={handleOnClear}
              >
                <X size={18} />
              </Button>
            )}
          </div>
          <Button
            size="icon"
            className="h-[38px] w-[54px]!"
            onClick={handleOnSearch}
            disabled={!value}
          >
            <Search size={18} />
          </Button>
        </div>
      </div>
    </SidebarContentWrapper>
  );
};
