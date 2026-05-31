import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LabelList,
} from "recharts";

const data = [
  { nivel: "Nível 1", alunos: 450 },
  { nivel: "Nível 2", alunos: 320 },
  { nivel: "Nível 3", alunos: 180 },
  { nivel: "Nível 4", alunos: 90 },
  { nivel: "Nível 5", alunos: 45 },
];

const colors = ["#669966", "#74A874", "#82B782", "#90C690", "#9FD59F"];

export default function StudentsChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#e5e7eb"
        />

        <XAxis
          dataKey="nivel"
          tick={{ fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis hide />

        <Tooltip />

        <Bar dataKey="alunos" radius={[4, 4, 0, 0]}>
          <LabelList
            dataKey="alunos"
            position="inside"
            fill="#fff"
            fontSize={11}
            fontWeight={700}
          />

          {data.map((_, index) => (
            <Cell key={index} fill={colors[index]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
