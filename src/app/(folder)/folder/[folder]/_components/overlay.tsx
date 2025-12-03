"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export const FileCardOverlay = ({ url }: { url: string }) => {
  return (
    <div className="border border-yellow-500 scale-95 drop-shadow-2xl shadow-2xl shadow-yellow-500">
      <Image
        priority
        unoptimized={true}
        src={`/proxy/image?url=${encodeURIComponent(url)}`}
        alt={""}
        width={180}
        height={180}
        className={cn([`aspect-square w-full h-full object-cover`])}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/placeholder.jpg";
        }}
      />
    </div>
  );
};
