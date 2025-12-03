import { useFolder } from "@queries";
import dayjs from "dayjs";
import { ChartBar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SidebarContentWrapper } from "@/ui/layout/sidebar/content-wrapper";

export function FolderSidebarInfo() {
  const { data: folder } = useFolder();

  return (
    <SidebarContentWrapper Icon={ChartBar} tooltip="Folder information">
      <div className="flex flex-col gap-1.5 text-base">
        {folder.created_by && typeof folder.created_by === "object" && (
          <p className="inline-flex items-center gap-1">
            Created by:
            <Image
              src={folder.created_by.photo_url}
              width={30}
              height={30}
              alt={folder.created_by.username}
              className="rounded-full object-cover mx-2"
            />
            <Link
              href={`https://t.me/${folder.created_by.username}`}
              target="_blank"
              className="text-[#0088CC]"
            >
              @{folder.created_by.username}
            </Link>
          </p>
        )}
        <p>
          Files:{" "}
          <span className="text-yellow-500">{"files" in folder ? folder.files.length : 0} </span>
        </p>
        <p>
          Views: <span className="text-yellow-500">{folder?.views}</span>
        </p>
        <p>
          Updated:{" "}
          <span className="text-yellow-500">{dayjs(folder?.last_updated_at).fromNow()}</span>
        </p>
        <p>
          Scanned:{" "}
          <span className="text-yellow-500">{dayjs(folder?.last_scanned_at).fromNow()}</span>
        </p>
        <p className="items-center">
          Created: <span className="text-yellow-500">{dayjs(folder?.created_at).fromNow()}</span>
        </p>
      </div>
    </SidebarContentWrapper>
  );
}
