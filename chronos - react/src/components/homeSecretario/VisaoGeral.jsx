import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { UserCircle } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

const dadosGrafico = {
  labels: diasSemana,
  datasets: [
    {
      label: "Total Alunos",
      data: [85, 70, 60, 38, 25, 45, 28],
      backgroundColor: "#22c55e",
      borderRadius: 4,
      barPercentage: 0.4,
    },
    {
      label: "Presença",
      data: [90, 75, 65, 30, 45, 58, 52],
      backgroundColor: "#60a5fa",
      borderRadius: 4,
      barPercentage: 0.4,
    },
  ],
};

const opcoes = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      align: "end",
      labels: { boxWidth: 10, font: { size: 11 } },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: { stepSize: 20, font: { size: 10 } },
      grid: { color: "#f0f0f0" },
    },
    x: {
      grid: { display: false },
      ticks: { font: { size: 10 } },
    },
  },
};

const alunosCriticos = [
  { nome: "Daniel Costa Avelino", percentual: "27% de Falta" },
  { nome: "Daniel Costa Avelino", percentual: "27% de Falta" },
  { nome: "Daniel Costa Avelino", percentual: "27% de Falta" },
  { nome: "Daniel Costa Avelino", percentual: "27% de Falta" },
];

function VisaoGeral({ totalFaltas = 45, alunos = alunosCriticos }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-bold tracking-wide uppercase text-gray-700">Visão Geral Acadêmico</h2>

      {/* Card superior: contador + tabela */}
      <div className="bg-white rounded-lg p-4 flex gap-4 shadow-sm">

        {/* Contador */}
        <div className="bg-gray-50 rounded-lg flex flex-col items-center justify-center px-5 py-4 min-w-[120px]">
          <span className="text-5xl font-black text-gray-900">{totalFaltas}</span>
          <p className="text-xs text-center text-gray-500 mt-1">Alunos com faltas<br />acima de 25%</p>
        </div>

        {/* Tabela */}
        <div className="flex-1">
          <h3 className="text-xs font-bold tracking-widest uppercase mb-2 text-gray-700">
            Lista de Aluno Críticos
          </h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-blue-50 text-gray-500 uppercase text-[10px]">
                <th className="py-1.5 px-2 text-left w-5">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="py-1.5 px-2 text-left">Nome</th>
                <th className="py-1.5 px-2 text-right">Percent. de Faltas</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-1.5 px-2">
                    <UserCircle size={18} className="text-green-500" />
                  </td>
                  <td className="py-1.5 px-2 text-gray-700">{aluno.nome}</td>
                  <td className="py-1.5 px-2 text-right">
                    <span className="bg-orange-200 text-orange-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                      {aluno.percentual}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-right mt-1">
            <a href="#" className="text-[10px] text-green-600 font-medium hover:underline">
              Ver Lista Completa
            </a>
          </p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-bold text-sm mb-3">Frequência Semanal</h3>
        <Bar data={dadosGrafico} options={opcoes} height={120} />
      </div>
    </div>
  );
}

export default VisaoGeral;
