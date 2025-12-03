import { useFile } from "@queries";
import dayjs from "dayjs";
import { ChartBar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TFileExtended } from "@/actions/files/get-one";
import { EventBus } from "@/lib/event-bus";
import { SidebarContentWrapper } from "@/ui/layout/sidebar/content-wrapper";
import { Skeleton } from "@/ui/ux/skeleton";

export const FileSidebarInfo = () => {
  const { data: file } = useFile();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const cleanup = EventBus.subscribe("navigated-to-sibling-file", () => {
      setIsLoading(true);
    });

    return () => {
      cleanup();
    };
  });

  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, []);

  return (
    <SidebarContentWrapper Icon={ChartBar} tooltip="File info">
      <div className="flex flex-col gap-1.5 text-[16px]">
        <Author file={file} isLoading={isLoading} />
        <Row title="Views" value={file?.views || 0} isLoading={isLoading} />
        <Row title="Name" value={file?.name || 0} isLoading={isLoading} />
        {file?.dimensions && (
          <Row
            title="Dimension"
            value={`${file.dimensions.width}x${file.dimensions.height}`}
            isLoading={isLoading}
          />
        )}
        <Row title="Size" value={formatSize(file?.size)} isLoading={isLoading} />
        <Row title="MD5" value={file?.md5 ? file.md5 : "missing"} isLoading={isLoading} />
        <Row title="Created" value={dayjs(file?.created_at).fromNow()} isLoading={isLoading} />
      </div>
    </SidebarContentWrapper>
  );
};

const Row = ({
  title,
  value,
  isLoading,
}: {
  title: string;
  value: string | number;
  isLoading: boolean;
}) => {
  return (
    <p className="flex items-center gap-2">
      {title}:{" "}
      <span className="text-yellow-500 w-full line-clamp-1">
        {isLoading ? <Skeleton className="h-3.5" /> : value}
      </span>
    </p>
  );
};

const Author = ({ file, isLoading }: { file: TFileExtended; isLoading: boolean }) => {
  if (!file.uploaded_by || typeof file.uploaded_by !== "object") return;

  if (isLoading) {
    return (
      <p className="inline-flex items-center justify-start">
        <span className="whitespace-nowrap mr-2.5">Uploaded by:</span>
        <Skeleton className="inline w-[30px] h-[30px] rounded-full mr-2" />
        <Skeleton className="h-3.5 w-[150px]" />
      </p>
    );
  }

  return (
    <p className="inline-flex items-center gap-1">
      Uploaded by:
      <Image
        src={file.uploaded_by.photo_url}
        width={30}
        height={30}
        alt={file.uploaded_by.username}
        className="rounded-full object-cover mx-2"
      />
      <Link
        href={`https://t.me/${file.uploaded_by.username}`}
        target="_blank"
        className="text-[#0088CC]"
      >
        @{file.uploaded_by.username}
      </Link>
    </p>
  );
};

const formatSize = (size: number) => {
  if (size > 1000000) {
    return `${Number(size / 1000000).toFixed(2)} Mb`;
  }

  return `${Number(size / 1000).toFixed(2)} Kb`;
};
