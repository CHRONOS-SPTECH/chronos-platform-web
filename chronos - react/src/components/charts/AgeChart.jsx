import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export default function AgeChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <XAxis
          dataKey="faixa"
          fontSize={11}
          stroke="#94A3B8"
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          fontSize={11}
          stroke="#94A3B8"
          tickLine={false}
          axisLine={false}
        />
        <Tooltip cursor={{ fill: "#F8FAFC" }} />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
        <Bar
          dataKey="mulheres"
          name="Mulheres"
          fill="#16A34A"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="homens"
          name="Homens"
          fill="#475569"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
