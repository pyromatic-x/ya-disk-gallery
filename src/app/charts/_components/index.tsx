"use client";

import { useCharts } from "@queries";
import { ChartWrapper } from "./chart-wrapper";

export const Charts = () => {
  const {
    data: { folders, tags, users, files },
  } = useCharts();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
      <ChartWrapper
        data={folders.most_popular}
        title="Most popular folders"
        description="Showing top 5 most viewed folders"
        area="Views"
      />
      <ChartWrapper
        data={folders.least_popular}
        title="Least popular folders"
        description="Showing top 5 least viewed folders"
        area="Views"
      />

      <ChartWrapper
        data={files.most_popular}
        title="Most popular files"
        description="Showing top 5 most viewed files"
        area="Views"
      />
      <ChartWrapper
        data={files.least_popular}
        title="Least popular files"
        description="Showing top 5 least viewed files"
        area="Views"
      />

      <ChartWrapper
        data={tags.most_popular}
        title="Most used tags"
        description="Showing top 5 most used tags among all folders"
        area="Used times"
      />
      <ChartWrapper
        data={tags.least_popular}
        title="Least used tags"
        description="Showing top 5 least used tags among all folders"
        area="Used times"
      />

      <ChartWrapper
        data={users.most_folders_created}
        title="Most folders created"
        description="Showing top 5 users by amount of created folders"
        area="Created"
      />
      <ChartWrapper
        data={users.most_files_uploaded}
        title="Most files uploaded"
        description="Showing top 5 users by amount of uploaded files"
        area="Uploaded"
      />
    </div>
  );
};
