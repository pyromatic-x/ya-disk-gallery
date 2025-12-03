"use server";

import { database } from "@database";
import { Folder, TFolder } from "@schemas";

export const action_get_random_folder = async () => {
  try {
    await database.connect();
    const folder: TFolder = (await Folder.aggregate([{ $match: {} }, { $sample: { size: 1 } }]))[0];

    return String(folder._id);
  } catch (error) {
    throw error as Error;
  }
};
