"use server";

import { User } from "@schemas";
import { cookies } from "next/headers";
import { action_scan_folders } from "../folders/scan";
import { upload_files_to_disk } from "./utils";

type TPayload = {
  path: string;
  source: Array<File> | string;
};

type TResponse = { added: number; errors: number };

export const action_upload_files = async ({ path, source }: TPayload): Promise<TResponse> => {
  try {
    const uid = (await cookies()).get("uid")?.value;
    if (!uid) {
      throw "Permission denied.";
    }

    const user = await User.findOne({ id: Number(uid) });
    if (!user) {
      throw "Permission denied.";
    }

    let files: Array<File> = [];
    if (typeof source === "string") {
      files = [await fetch_file(source)];
    } else files = source;

    const upload_result = await upload_files_to_disk(path, files);

    const counters: TResponse = {
      added: upload_result.filter((t) => t.value.success).length,
      errors: upload_result.filter((t) => !t.value.success).length,
    };

    await action_scan_folders(path);

    return counters;
  } catch (error) {
    throw error as Error;
  }
};

const fetch_file = async (url: string): Promise<File> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type") || "";

  const isImage = contentType.startsWith("image/");
  const isVideo = contentType.startsWith("video/");

  if (!isImage && !isVideo) {
    throw new Error(`Invalid file type, got: ${contentType}`);
  }

  const urlObj = new URL(url);
  const filename = urlObj.pathname.split("/").pop() || `new_file`;

  const blob = await response.blob();

  return new File([blob], filename, { type: contentType });
};
