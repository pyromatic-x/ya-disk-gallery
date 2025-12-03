import { useFolder } from "@queries";
import { Link as LinkIcon, Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/ui/form/button";
import { SidebarContentWrapper } from "@/ui/layout/sidebar/content-wrapper";
import { Badge } from "@/ui/shared/badge";
import { FolderSidebarLinksEdit } from "./edit";

export const FolderSidebarLinks = () => {
  const { data: folder } = useFolder();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarContentWrapper Icon={LinkIcon} tooltip="Folder links">
      <div className="flex flex-col gap-2">
        {folder.links?.length ? (
          <div className="flex flex-wrap gap-1">
            {folder.links.map((t) => (
              <Link key={t} href={t} target="_blank">
                <Badge className="hover:text-blue-300 cursor-alias">{get_hostname(t)}</Badge>
              </Link>
            ))}
          </div>
        ) : (
          <p>No links specified</p>
        )}

        <Button
          variant="black"
          size="icon"
          className="h-[22px] w-[22px] absolute -bottom-1 right-1.5"
          onClick={() => setIsOpen(true)}
        >
          <Settings size={14} />
        </Button>

        <FolderSidebarLinksEdit isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </SidebarContentWrapper>
  );
};

const get_hostname = (link: string) => {
  const url_with_protocol = link.includes("://") ? link : `https://${link}`;
  const raw = new URL(url_with_protocol).hostname;

  return raw.replaceAll("www.", "");
};
