"use server";

import { database } from "@database";
import { disk, TDiskDirectory } from "@disk";
import { File, Folder, TUser, User } from "@schemas";
import mongoose from "mongoose";
import { cookies } from "next/headers";

type TResponse = {
  scanned_folders: number;
  created_folders: number;
  updated_folders: number;
  added_files: number;
  errors?: number;
};

export const action_scan_folders = async (path?: string): Promise<TResponse> => {
  try {
    const uid = (await cookies()).get("uid")?.value;
    if (!uid) throw "Permission denied.";

    const user = await User.findOne({ id: Number(uid) });
    if (!user) throw "Permission denied.";

    return scan(user, path);
  } catch (error) {
    throw error as Error;
  }
};

const scan = async (user: TUser, path?: string | null) => {
  await database.connect();

  const counters: TResponse = {
    scanned_folders: 0,
    created_folders: 0,
    updated_folders: 0,
    added_files: 0,
  };

  if (path) {
    const directory = (await disk.get.one({ path })) as TDiskDirectory;

    await scan_folder(user, directory, counters);
  } else {
    const directories = await disk.get.all();

    const parallel = 5;

    for (let i = 0; i < directories.length; i += parallel) {
      const chunk = directories.slice(i, i + parallel);
      await Promise.all(chunk.map((folder) => scan_folder(user, folder, counters)));
    }
  }

  return counters;
};

const scan_folder = async (user: TUser, directory: TDiskDirectory, counters: TResponse) => {
  let folder = await Folder.findOne({ path: directory.path }).lean();

  if (!folder) {
    folder = await Folder.insertOne({
      names: [directory.name],
      path: directory.path,
      preview_url: "",
      tags: [],
      links: [],
      created_at: new Date(directory.created),
      last_scanned_at: new Date(),
      last_updated_at: new Date(),
      created_by: user._id,
    });

    counters.created_folders += 1;
  }

  const diskItems = await getDiskFolderFiles(directory.path);
  const files = await File.find({ folder: folder._id }).lean();

  if (diskItems.length > files.length) {
    const map = (t: (typeof diskItems)[0], index: number) => ({
      ...t,
      folder: folder._id,
      seen_update: false,
      created_at: new Date(t.created),
      uploaded_by: user._id,
      index,
    });

    const diff = files.length
      ? diskItems.filter((t) => !files.some((j) => j.md5 === t.md5 || j.path === t.path)).map(map)
      : diskItems.map(map);

    await File.updateMany(
      { folder: new mongoose.Types.ObjectId(folder._id) },
      { $inc: { index: diff.length } },
    );

    await File.insertMany(diff, { lean: true });

    const update: Record<string, string | Date> = {
      last_updated_at: new Date(),
    };
    if (!folder.preview_url) update.preview_url = diskItems[0].preview_url;

    await Folder.findOneAndUpdate(
      { path: directory.path },
      {
        $set: update,
      },
    );

    counters.added_files += diff.length;
    counters.updated_folders += 1;
  }

  await Folder.findOneAndUpdate(
    { path: directory.path },
    {
      $set: {
        last_scanned_at: new Date(),
      },
    },
  );

  counters.scanned_folders += 1;

  return counters;
};

const getDiskFolderFiles = async (path: string) => {
  const folder = (await disk.get.one({ path })) as TDiskDirectory;

  return (folder._embedded?.items || [])
    .filter((t) => t.type === "file")
    .map((t) => ({
      ...t,
      // biome-ignore lint/style/noNonNullAssertion: skip
      preview_url: t.sizes.find((t) => t.name === "L")!.url,
    }));
};
