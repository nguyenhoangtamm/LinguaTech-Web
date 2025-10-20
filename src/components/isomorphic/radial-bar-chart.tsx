"use client";

import {
  RadialBarChart as RadialBarChartComponent,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";
// Define the type for the data expected by RadialBarChart
interface ChartData {
  name: string;
  sales: number;
  fill: string;
}

// Define the props for the component
interface RadialBarChartProps {
  isMobile: boolean;
}
const isMobile = true;
export default function RadialBarChart() {
  const data: ChartData[] = [
    { name: "Category A", sales: 400, fill: "#8884d8" },
    { name: "Category B", sales: 300, fill: "#83a6ed" },
    { name: "Category C", sales: 200, fill: "#8dd1e1" },
    { name: "Category D", sales: 100, fill: "#82ca9d" },
  ];
  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      className="[&_.recharts-default-legend]:flex [&_.recharts-default-legend]:flex-wrap [&_.recharts-default-legend]:justify-center @xl:[&_.recharts-default-legend]:flex-col [&_.recharts-legend-wrapper]:!static [&_.recharts-legend-wrapper]:!-mt-[22px] [&_.recharts-legend-wrapper]:!leading-[22px] @xs:[&_.recharts-legend-wrapper]:!mt-0 @xl:[&_.recharts-legend-wrapper]:!absolute @xl:[&_.recharts-legend-wrapper]:!end-0 @xl:[&_.recharts-legend-wrapper]:!start-auto @xl:[&_.recharts-legend-wrapper]:!top-1/2 @xl:[&_.recharts-legend-wrapper]:!-translate-y-1/2 @xl:[&_.recharts-legend-wrapper]:!translate-x-0 @xl:[&_.recharts-legend-wrapper]:!leading-9"
    >
      <RadialBarChartComponent
        innerRadius="20%"
        outerRadius="110%"
        barSize={isMobile ? 16 : 24}
        data={data}
        className="rtl:[&_.recharts-legend-item>svg]:ml-1"
      >
        <RadialBar
          label={{ fill: "#ffffff", position: "insideStart" }}
          background
          dataKey="sales"
          className="[&_.recharts-radial-bar-background-sector]:fill-gray-100"
        />
        <Legend iconSize={10} layout="vertical" verticalAlign="middle" />
      </RadialBarChartComponent>
    </ResponsiveContainer>
  );
}
