"use server";

import { database } from "@database";
import { Folder } from "@schemas";
import mongoose from "mongoose";

type TPayload = {
  folder: string;
  names: Array<string>;
};

export const action_update_folder_names = async ({ folder, names }: TPayload) => {
  try {
    await database.connect();

    await Folder.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(folder),
      },
      {
        $set: {
          names,
          last_updated_at: new Date(),
        },
      },
    );

    return true;
  } catch (error) {
    throw error as Error;
  }
};
