"use client";

import { TFile } from "@schemas";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ContextMenuItem } from "@/ui/ux/context-menu";

export const FileCardMenuOpen = ({ _id, folder, preview_url }: TFile) => {
  const [hostname, setHostname] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHostname(window.location.hostname);
    }
  }, []);

  const href = `/folder/${folder}/file/${_id}`;
  const url = `https://${hostname}/proxy/image?url=${encodeURIComponent(preview_url as string)}`;

  const openOnGoogle = () => {
    const searchUrl = `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(url)}`;
    window.open(searchUrl, "_blank", "noopener,noreferrer");
  };

  const openOnYandex = () => {
    const searchUrl = `https://yandex.ru/images/search?url=${encodeURIComponent(url)}&rpt=imageview`;
    window.open(searchUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <ContextMenuItem>
        <Link href={href}>Open</Link>
      </ContextMenuItem>
      <ContextMenuItem onClick={openOnGoogle}>Open in Google</ContextMenuItem>
      <ContextMenuItem onClick={openOnYandex}>Open in Yandex</ContextMenuItem>
    </>
  );
};
