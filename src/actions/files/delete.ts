"use server";

import { database } from "@database";
import { disk } from "@disk";
import { File, Folder } from "@schemas";
import mongoose from "mongoose";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/common";

type TPayload = {
  folder_id: string;
  file_id: string;
  file_path: string;
};

export const action_delete_file = async ({ folder_id, file_id, file_path }: TPayload) => {
  try {
    try {
      await disk.delete({ path: file_path });
    } catch (error) {
      const err = error as Error;
      if (err.message !== "Resource not found.") throw err?.message || DEFAULT_ERROR_MESSAGE;
    }

    await database.connect();

    await File.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(file_id),
    });

    await Folder.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(folder_id) },
      { $set: { last_updated_at: new Date() } },
    );

    return true;
  } catch (error) {
    throw error as Error;
  }
};
