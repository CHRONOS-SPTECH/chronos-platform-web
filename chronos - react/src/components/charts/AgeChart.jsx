import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { idade: "18-24", mulheres: 130, homens: 120 },
  { idade: "25-34", mulheres: 260, homens: 250 },
  { idade: "35-44", mulheres: 220, homens: 210 },
  { idade: "45-54", mulheres: 160, homens: 150 },
  { idade: "55-64", mulheres: 100, homens: 90 },
];

function AgeChart() {
  return (
    <div className="age-card">
      <h3>FAIXAS ETÁRIAS</h3>

      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={data}
          layout="vertical"
        >
          <XAxis type="number" />

          <YAxis
            dataKey="idade"
            type="category"
          />

          <Tooltip />

          <Bar
            dataKey="mulheres"
            fill="#5d8d5d"
            radius={[0, 10, 10, 0]}
          />

          <Bar
            dataKey="homens"
            fill="#2ecc71"
            radius={[0, 10, 10, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AgeChart;