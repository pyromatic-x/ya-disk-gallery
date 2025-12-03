"use server";

import { database } from "@database";
import { File, Folder } from "@schemas";

export const action_get_counts = async () => {
  try {
    await database.connect();
    return {
      folders: await Folder.countDocuments(),
      files: await File.countDocuments(),
    };
  } catch (error) {
    throw error as Error;
  }
};
