"use server";

import { database } from "@database";
import { disk } from "@disk";
import { File, Folder } from "@schemas";
import mongoose from "mongoose";

type TPayload = {
  id: string;
  path: string;
};

export const action_delete_folder = async ({ id, path }: TPayload) => {
  try {
    await database.connect();

    await Folder.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) });
    await File.deleteMany({ folder: new mongoose.Types.ObjectId(id) });
    await disk.delete({ path });

    return true;
  } catch (error) {
    throw error as Error;
  }
};
