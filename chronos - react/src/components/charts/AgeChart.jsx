import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const data = [
  { idade: "18-24", mulheres: 80, homens: 65 },
  { idade: "25-34", mulheres: 150, homens: 120 },
  { idade: "35-44", mulheres: 130, homens: 110 },
  { idade: "45-54", mulheres: 90, homens: 85 },
  { idade: "55-64", mulheres: 60, homens: 55 },
  { idade: "65+", mulheres: 32, homens: 33 },
];

export default function AgeChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical">
        <CartesianGrid stroke="#f1f5f9" horizontal={false} />

        <XAxis type="number" />

        <YAxis type="category" dataKey="idade" tick={{ fontSize: 11 }} />

        <Tooltip />

        <Legend />

        <Bar
          dataKey="mulheres"
          stackId="a"
          fill="#5f9460"
          radius={[4, 0, 0, 4]}
        />

        <Bar
          dataKey="homens"
          stackId="a"
          fill="#34c96d"
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
