import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function StudentsChart({ data = [] }) {
  const chartData = data.map((item) => ({
    name: `Nível ${item.nivel}`,
    total: item.total_alunos,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <XAxis
          dataKey="name"
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
        <Bar dataKey="total" fill="#15803D" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
