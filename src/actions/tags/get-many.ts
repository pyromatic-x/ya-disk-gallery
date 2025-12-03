"use server";

import { database } from "@database";
import { Tag, TTag } from "@schemas";

export const action_get_tags = async (): Promise<Array<TTag>> => {
  try {
    await database.connect();

    const tags = await Tag.find().sort({ value: 1 });

    return tags.map((tag) => tag.toJSON()) as Array<TTag>;
  } catch (error) {
    throw error as Error;
  }
};
