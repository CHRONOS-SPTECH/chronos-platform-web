import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";

const data = [
  { nivel: "Nível 1", alunos: 450 },
  { nivel: "Nível 2", alunos: 320 },
  { nivel: "Nível 3", alunos: 180 },
  { nivel: "Nível 4", alunos: 90 },
  { nivel: "Nível 5", alunos: 45 },
];

function StudentsChart() {
  return (
    <div className="chart-card">
      <h3>ALUNOS POR NÍVEL</h3>

      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={data}>
          <XAxis dataKey="nivel" />

          <Tooltip />

          <Bar
            dataKey="alunos"
            fill="#6ea76e"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StudentsChart;