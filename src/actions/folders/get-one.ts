"use server";

import { database } from "@database";
import { Folder, TFile, TFolder } from "@schemas";
import mongoose from "mongoose";

export interface TFolderExtended extends Omit<TFolder, "created_by"> {
  files: Array<TFile>;
  created_by: {
    _id: string;
    username: string;
    photo_url: string;
  } | null;
}

export const action_get_folder = async ({ id }: { id: string }): Promise<TFolderExtended> => {
  try {
    await database.connect();

    const response = await Folder.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: "files",
          localField: "_id",
          foreignField: "folder",
          as: "files",
          pipeline: [
            {
              $addFields: {
                _id: { $toString: "$_id" },
                folder: { $toString: "$folder" },
                sortField: {
                  $ifNull: ["$index", Number.MAX_SAFE_INTEGER],
                },
              },
            },
            { $sort: { sortField: 1, created_at: -1 } },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "created_by",
          foreignField: "_id",
          as: "created_by",
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
          tags: {
            $map: {
              input: "$tags",
              as: "tag",
              in: { $toString: "$$tag" },
            },
          },
          created_by: {
            $cond: {
              if: { $gt: [{ $size: "$created_by" }, 0] },
              // biome-ignore lint/suspicious/noThenProperty: mongo specific
              then: { $arrayElemAt: ["$created_by", 0] },
              else: null,
            },
          },
        },
      },
    ]);

    const folder: TFolderExtended = response[0];

    folder.files.forEach((file) => {
      file.uploaded_by = file.uploaded_by.toString();
    });

    return folder;
  } catch (error) {
    throw error as Error;
  }
};
