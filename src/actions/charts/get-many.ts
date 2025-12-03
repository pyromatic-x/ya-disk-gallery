"use server";

import { database } from "@database";
import { File, Folder, Tag, TFile, TFolder, User } from "@schemas";
import { Document } from "mongoose";
import { capitalizeFirstLetterOfEachWord } from "@/lib/utils";

export type TChartData = Array<TData>;

type TData = {
  name: string;
  value: number;
  link: { title: string; url: string };
};

export const action_get_charts = async () => {
  try {
    await database.connect();

    const tags = await fetch_tags_charts();
    const folders = await fetch_folders_charts();
    const files = await fetch_files_charts();
    const users = await fetch_users_charts();

    return { tags, folders, files, users };
  } catch (error) {
    throw error as Error;
  }
};

const fetch_tags_charts = async () => {
  const tags = await Tag.find().lean();
  const folders = (await Folder.find()).map((t) => t.toJSON());

  const tags_from_folders = folders.flatMap((t) => t.tags);

  const data: TChartData = tags.map((t) => {
    const name = capitalizeFirstLetterOfEachWord(t.value.replaceAll("-", " "));
    const value = tags_from_folders.filter((j) => String(j) === String(t._id)).length;

    const link: TData["link"] = {
      title: name,
      url: `/?tags=${t._id}`,
    };

    return { name, value, link };
  });

  data.sort((a, b) => a.name.localeCompare(b.name));

  const most_popular: TChartData = data.toSorted((a, b) => b.value - a.value).slice(0, 5);
  const least_popular: TChartData = data
    .toSorted((a, b) => a.value - b.value)
    .slice(0, 5)
    .toSorted((a, b) => b.value - a.value);

  return { most_popular, least_popular };
};

const fetch_folders_charts = async () => {
  const map = (t: TFolder) => ({
    name: t.names[0],
    value: t.views,
    link: { title: t.names[0], url: `/folder/${t._id}` },
  });

  const most_popular: TChartData = (await Folder.find({}).sort({ views: -1 }).limit(5)).map(map);
  const least_popular: TChartData = (await Folder.find({}).sort({ views: 1 }).limit(5)).map(map);

  return { most_popular, least_popular };
};

const fetch_files_charts = async () => {
  const map = (t: Document<unknown, {}, TFile, {}, {}> & TFile) => {
    const parsed = t.toJSON();

    const name = parsed.name.length > 7 ? `${parsed.name.slice(0, 6)}...` : parsed.name;

    return {
      name,
      value: parsed.views,
      link: { title: name, url: `/folder/${parsed.folder}/file/${parsed._id}` },
    };
  };

  const most_popular: TChartData = (await File.find({}).sort({ views: -1 }).limit(5)).map(map);
  const least_popular: TChartData = (await File.find({}).sort({ views: 1 }).limit(5)).map(map);

  return { most_popular, least_popular };
};

const fetch_users_charts = async () => {
  const most_folders_created: TChartData = await User.aggregate([
    { $match: {} },
    { $limit: 5 },
    {
      $lookup: {
        from: "folders",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$created_by", "$$userId"] },
            },
          },
          {
            $count: "count",
          },
        ],
        as: "folders",
      },
    },
    {
      $project: {
        _id: 0,
        name: "$username",
        value: {
          $ifNull: [{ $arrayElemAt: ["$folders.count", 0] }, 0],
        },
        link: {
          title: "$username",
          url: {
            $concat: ["https://t.me/", "$username"],
          },
        },
      },
    },
  ]);

  const most_files_uploaded: TChartData = await User.aggregate([
    { $match: {} },
    { $limit: 5 },
    {
      $lookup: {
        from: "files",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$uploaded_by", "$$userId"] },
            },
          },
          {
            $count: "count",
          },
        ],
        as: "files",
      },
    },
    {
      $project: {
        _id: 0,
        name: "$username",
        value: {
          $ifNull: [{ $arrayElemAt: ["$files.count", 0] }, 0],
        },
        link: {
          title: "$username",
          url: {
            $concat: ["https://t.me/", "$username"],
          },
        },
      },
    },
  ]);

  return { most_folders_created, most_files_uploaded };
};
