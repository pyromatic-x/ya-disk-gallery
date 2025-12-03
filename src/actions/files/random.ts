"use server";

import { database } from "@database";
import { File, Folder, TFile, TFolder } from "@schemas";
import mongoose from "mongoose";

export const action_get_random_file = async () => {
  try {
    await database.connect();

    const folder: TFolder = (await Folder.aggregate([{ $match: {} }, { $sample: { size: 1 } }]))[0];
    const file: TFile = (
      await File.aggregate([
        { $match: { folder: new mongoose.Types.ObjectId(folder._id) } },
        { $sample: { size: 1 } },
      ])
    )[0];

    return { folder: folder._id, file: file._id };
  } catch (error) {
    throw error as Error;
  }
};
