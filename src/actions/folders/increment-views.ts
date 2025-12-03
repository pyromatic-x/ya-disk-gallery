"use server";

import { database } from "@database";
import { Folder } from "@schemas";
import mongoose from "mongoose";

export const action_increment_folder_views = async (id: string) => {
  try {
    await database.connect();
    await Folder.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $inc: { views: 1 } });

    return true;
  } catch (error) {
    throw error as Error;
  }
};
