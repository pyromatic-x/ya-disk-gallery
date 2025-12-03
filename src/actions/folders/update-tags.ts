"use server";

import { database } from "@database";
import { Folder } from "@schemas";
import mongoose from "mongoose";

type TPayload = {
  folder: string;
  tags: Array<string>;
};

export const action_update_folder_tags = async ({ folder, tags }: TPayload) => {
  try {
    await database.connect();

    await Folder.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(folder),
      },
      {
        $set: {
          tags: tags.map((t) => new mongoose.Types.ObjectId(t)),
          last_updated_at: new Date(),
        },
      },
    );

    return true;
  } catch (error) {
    throw error as Error;
  }
};
