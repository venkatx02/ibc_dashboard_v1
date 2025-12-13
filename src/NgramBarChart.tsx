import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

type NgramData = {
  ngram: string;
  freq: number;
};

interface NgramBarChartProps {
  data: NgramData[];
}

export default function NgramBarChart({ data }: NgramBarChartProps) {
  return (
    <BarChart
      width={600}
      height={400}
      data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
    >
      <XAxis
        dataKey="ngram"
        angle={-45}
        textAnchor="end"
        interval={0}
        height={70} // Add height so rotated labels fit
        tick={{ fontSize: 12 }}
      />
      <YAxis />
      <Tooltip />
      <Bar dataKey="freq" fill="#4682B4" />
    </BarChart>
  );
}