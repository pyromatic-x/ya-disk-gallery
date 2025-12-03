"use server";

import { database } from "@database";
import { File } from "@schemas";
import mongoose from "mongoose";

type TPayload = {
  files: Array<{ id: string; index: number }>;
};

export const action_rearrange_files = async ({ files }: TPayload) => {
  try {
    await database.connect();

    const ops = files.map(({ id, index }) => ({
      updateOne: {
        filter: { _id: new mongoose.Types.ObjectId(id) },
        update: { $set: { index } },
      },
    }));

    await File.bulkWrite(ops);

    return true;
  } catch (error) {
    throw error as Error;
  }
};
