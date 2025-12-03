"use client";

import Link from "next/link";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { TChartData } from "@/actions/charts/get-many";
import { useDevice } from "@/hooks/use-device";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/shared/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/ui/ux/chart";

export const ChartWrapper = ({
  data,
  title,
  description,
  area,
}: {
  data: TChartData;
  title: string;
  description: string;
  area: string;
}) => {
  const { isMobile } = useDevice();

  const chartConfig = data.reduce((acc, item) => {
    acc[item.name] = {
      label: item.name,
    };
    return acc;
  }, {} as ChartConfig) satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto min-h-[200px] w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: isMobile ? 10 : 30,
              right: isMobile ? 10 : 30,
            }}
          >
            <CartesianGrid vertical={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <XAxis dataKey="name" interval={0} tickMargin={-8} tickLine={false} angle={-45} />
            <Area
              name={area}
              dataKey="value"
              fill="var(--secondary)"
              fillOpacity={0.5}
              stroke="var(--chart-3)"
              strokeWidth={2}
              type="natural"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="justify-around gap-2">
        {data.map((t) => (
          <CardAction key={t.name + t.link.url} className="text-sm text-blue-400">
            <Link href={t.link.url}>{t.link.title}</Link>
          </CardAction>
        ))}
      </CardFooter>
    </Card>
  );
};
