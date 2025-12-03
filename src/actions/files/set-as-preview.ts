"use server";

import { database } from "@database";
import { disk, TDiskFile } from "@disk";
import { Folder } from "@schemas";
import mongoose from "mongoose";

type TPayload = {
  folder_id: string;
  file_id: string;
  file_path: string;
};

export const action_set_file_as_preview = async ({ folder_id, file_path }: TPayload) => {
  try {
    await database.connect();

    const diskFile = (await disk.get.one({
      path: file_path,
    })) as TDiskFile;

    // biome-ignore lint/style/noNonNullAssertion: skip
    const preview_url = diskFile.sizes.find((t: { name: string }) => t.name === "L")!.url;

    await Folder.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(folder_id),
      },
      {
        $set: {
          preview_url,
          last_updated_at: new Date(),
        },
      },
    );

    return true;
  } catch (error) {
    throw error as Error;
  }
};
