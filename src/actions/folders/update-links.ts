"use server";

import { database } from "@database";
import { Folder } from "@schemas";
import mongoose from "mongoose";

type TPayload = {
  folder: string;
  links: Array<string>;
};

export const action_update_folder_links = async ({ folder, links }: TPayload) => {
  try {
    await database.connect();

    await Folder.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(folder),
      },
      {
        $set: {
          links,
          last_updated_at: new Date(),
        },
      },
    );

    return true;
  } catch (error) {
    throw error as Error;
  }
};
