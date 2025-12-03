"use server";

import { database } from "@database";
import { disk } from "@disk";
import { Folder } from "@schemas";
import mongoose from "mongoose";
import { upload_files_to_disk } from "../files/utils";

type TPayload = {
  files: Array<File>;
  names: Array<string>;
  tags: Array<string>;
  links: Array<string>;
};

export const action_create_folder = async ({ files, names, tags, links }: TPayload) => {
  try {
    await database.connect();

    const name = names[0];

    const path = `${process.env.FOLDER_PATH}/${name}`;

    await disk.create({ path });
    await upload_files_to_disk(path, files);

    const folder = await Folder.insertOne({
      names,
      path,
      links: links || [],
      preview_url: "",
      tags: (tags || []).map((t: string) => new mongoose.Types.ObjectId(t)),
      created_at: new Date(),
      last_scanned_at: new Date(),
      last_updated_at: new Date(),
    });

    return String(folder._id);
  } catch (error) {
    throw error as Error;
  }
};
