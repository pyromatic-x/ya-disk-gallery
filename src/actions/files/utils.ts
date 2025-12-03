"use server";

import { database } from "@database";
import { disk } from "@disk";

type TResponse = Array<{
  status: string;
  value: { success: boolean; name: string; error?: Error };
}>;

export const upload_files_to_disk = async (
  folder_path: string,
  files: Array<File>,
): Promise<TResponse> => {
  const upload = async (file: File) => {
    try {
      await database.connect();

      const path = `${folder_path}/${file.name}`;

      const result = await disk.upload({ path, file });

      await new Promise((resolve) => setTimeout(resolve, 1000)); // just to be sure file uploaded to the disk

      return {
        success: true,
        status: result.status,
        name: file.name,
      };
    } catch (error) {
      return {
        success: false,
        name: file.name,
        error,
      };
    }
  };

  return Promise.allSettled(files.map(upload)) as Promise<TResponse>;
};
