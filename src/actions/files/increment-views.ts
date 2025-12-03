"use server";

import { database } from "@database";
import { File } from "@schemas";
import mongoose from "mongoose";

export const action_increment_file_views = async (id: string) => {
  try {
    await database.connect();
    await File.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { $inc: { views: 1 } });

    return true;
  } catch (error) {
    throw error as Error;
  }
};
