"use server";

import { database } from "@database";
import { Folder, TFolder } from "@schemas";
import mongoose, { FilterQuery, SortOrder } from "mongoose";

export interface TActionGetManyFilesPayload {
  search?: string;
  tags?: string;
  sort?:
    | "popularity"
    | "name-a-z"
    | "name-z-a"
    | "added-recently"
    | "added-long-ago"
    | "updated-recently"
    | "updated-long-ago";
}

export const action_get_many_folders = async ({
  search,
  tags,
  sort,
}: TActionGetManyFilesPayload): Promise<Array<TFolder>> => {
  try {
    await database.connect();

    const query: FilterQuery<TFolder> = {};
    const _sort: Partial<Record<keyof TFolder, SortOrder>> = {};

    if (search) {
      query.names = {
        $elemMatch: {
          $regex: search,
          $options: "i",
        },
      };
    }

    if (tags) {
      query.tags = { $all: tags.split(",").map((id) => new mongoose.Types.ObjectId(id)) };
    }

    if (sort === "added-recently") _sort.created_at = -1;
    else if (sort === "added-long-ago") _sort.created_at = 1;
    else if (sort === "updated-recently") _sort.last_updated_at = -1;
    else if (sort === "updated-long-ago") _sort.last_updated_at = 1;
    else if (sort === "popularity" || !sort) _sort.views = -1;

    const folders = await Folder.find(query).sort(_sort);
    const result = folders.map((folder) => folder.toJSON());

    if (sort === "name-a-z" || sort === "name-z-a") {
      result.sort((a, b) => {
        if (sort === "name-a-z") {
          return a.first_name.localeCompare(b.first_name);
        } else {
          return b.first_name.localeCompare(a.first_name);
        }
      });
    }

    return result;
  } catch (error) {
    throw error as Error;
  }
};
