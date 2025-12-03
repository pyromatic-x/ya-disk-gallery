"use server";

import { database } from "@database";
import { Tag } from "@schemas";
import mongoose from "mongoose";

type TPayload = {
  deleted: Array<string>; // array of ObjectID
  added: Array<string>; // array of values
};

export const action_update_tags = async ({ deleted, added }: TPayload) => {
  try {
    await database.connect();

    const _deleted = deleted.map((t) => new mongoose.Types.ObjectId(t));
    const _added = added.map((t) => ({
      value: t.toLowerCase().trim().replaceAll(" ", "-"),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    if (_deleted.length) {
      await Tag.deleteMany({ _id: { $in: _deleted } });
    }
    if (_added.length) {
      await Tag.insertMany(_added);
    }

    return true;
  } catch (error) {
    throw error as Error;
  }
};
