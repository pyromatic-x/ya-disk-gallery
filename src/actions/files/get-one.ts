"use server";

import { database } from "@database";
import { disk, TDiskFile } from "@disk";
import { File, TFile } from "@schemas";
import mongoose from "mongoose";

export interface TFileExtended extends Omit<TFile, "uploaded_by"> {
  prev: string | null;
  next: string | null;
  full_url: string;
  uploaded_by: {
    _id: string;
    username: string;
    photo_url: string;
  } | null;
}

export const action_get_file = async ({ id }: { id: string }): Promise<TFileExtended> => {
  try {
    await database.connect();

    const aggregation = await File.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      { $limit: 1 },
      {
        $lookup: {
          from: "users",
          localField: "uploaded_by",
          foreignField: "_id",
          as: "uploaded_by",
          pipeline: [
            {
              $addFields: {
                _id: { $toString: "$_id" },
              },
            },
            {
              $project: {
                _id: 0,
                photo_url: 1,
                username: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          _id: { $toString: "$_id" },
          folder: { $toString: "$folder" },
          uploaded_by: {
            $cond: {
              if: { $gt: [{ $size: "$uploaded_by" }, 0] },
              // biome-ignore lint/suspicious/noThenProperty: mongo specific
              then: { $arrayElemAt: ["$uploaded_by", 0] },
              else: null,
            },
          },
        },
      },
    ]);

    const file: TFileExtended = aggregation[0];

    const next = await get_siblings({ file, direction: "next" });
    const prev = await get_siblings({ file, direction: "prev" });

    const disk_file = (await disk.get.one({ path: file?.path })) as TDiskFile;

    return {
      ...file,
      full_url: disk_file.media_type === "video" ? disk_file.file : disk_file.sizes[0].url,
      next,
      prev,
    } as TFileExtended;
  } catch (error) {
    throw error as Error;
  }
};

const get_siblings = async ({
  file,
  direction,
}: {
  file: TFileExtended;
  direction: "next" | "prev";
}) => {
  const sibling = await File.findOne({
    folder: new mongoose.Types.ObjectId(file.folder),
    index: direction === "next" ? file.index + 1 : file.index - 1,
  });
  return sibling ? String(sibling._id) : null;
};
