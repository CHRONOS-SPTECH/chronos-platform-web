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

// Configurações do gráfico (mantidas, mas com ajuste de padding)
const diasSemana = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];
const dadosGrafico = {
  labels: diasSemana,
  datasets: [
    {
      label: "Total Alunos",
      data: [85, 70, 60, 38, 25, 45, 28],
      backgroundColor: "#22c55e",
      borderRadius: 4,
      barPercentage: 0.5,
    },
    {
      label: "Presença",
      data: [90, 75, 65, 30, 45, 58, 52],
      backgroundColor: "#60a5fa",
      borderRadius: 4,
      barPercentage: 0.5,
    },
  ],
};

const opcoes = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      align: "end",
      labels: {
        boxWidth: 8,
        font: { size: 10, weight: "bold" },
        usePointStyle: true,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: { size: 9 },
      grid: { color: "#f3f4f6" },
    },
    x: { grid: { display: false }, ticks: { size: 9 } },
  },
};

function VisaoGeral({ totalFaltas = 45, alunos = alunosCriticos }) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Título Externo Opcional */}
      <h2 className="text-xs font-black tracking-[0.2em] uppercase text-gray-400 mb-3 ml-1">
        Dashboard Acadêmico
      </h2>

      {/* CONTAINER ÚNICO (O GRANDE QUADRADO) */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {/* PARTE SUPERIOR: CONTADOR E TABELA */}
        <div className="flex border-b border-gray-100">
          {/* Contador Lateral */}
          <div className="w-1/4 bg-gray-50/50 p-6 flex flex-col items-center justify-center border-r border-gray-100 text-center">
            <div className="relative">
              <span className="text-6xl font-black text-gray-900 leading-none">
                {totalFaltas}
              </span>
              <span className="absolute -top-1 -right-2 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-tighter text-gray-400 mt-3 leading-tight">
              Alunos Críticos <br />
              (+25% Faltas)
            </p>
          </div>

          {/* Tabela ao Lado */}
          <div className="flex-1 p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-600">
                Lista de Risco
              </h3>
              <a
                href="#"
                className="text-[10px] text-green-600 font-bold hover:text-green-700 transition-colors"
              >
                VER TODOS →
              </a>
            </div>

            <div className="overflow-hidden">
              <table className="w-full">
                <tbody>
                  {alunos.slice(0, 4).map((aluno, i) => (
                    <tr
                      key={i}
                      className="group border-b border-gray-50 last:border-0"
                    >
                      <td className="py-2 pr-2 w-8">
                        <UserCircle
                          size={24}
                          className="text-gray-300 group-hover:text-green-500 transition-colors"
                        />
                      </td>
                      <td className="py-2 text-[13px] font-medium text-gray-700">
                        {aluno.nome}
                      </td>
                      <td className="py-2 text-right">
                        <span className="bg-orange-50 text-orange-600 text-[10px] px-2 py-1 rounded-md font-bold border border-orange-100">
                          {aluno.percentual}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* PARTE INFERIOR: GRÁFICO */}
        <div className="p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-600">
              Frequência Semanal vs Capacidade
            </h3>
          </div>
          <div className="h-[220px] w-full">
            <Bar data={dadosGrafico} options={opcoes} />
          </div>
        </div>
      </div>
    </div>
  );
}

const alunosCriticos = [
  { nome: "Daniel Costa Avelino", percentual: "27% Faltas" },
  { nome: "Marina Silva Souza", percentual: "32% Faltas" },
  { nome: "Lucas Pereira Lima", percentual: "29% Faltas" },
];

export default VisaoGeral;
