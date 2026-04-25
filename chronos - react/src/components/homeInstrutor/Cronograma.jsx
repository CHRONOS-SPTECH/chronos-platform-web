import { Check, Play } from "lucide-react";

const statusConfig = {
  concluida: {
    label: "Concluída",
    icon: <Check size={12} strokeWidth={3} />,
    circleClass: "bg-[#e8f5e9] text-[#2d7a2d]",
    badgeClass: "bg-[#e8f5e9] text-[#2d7a2d]",
  },
  andamento: {
    label: "andamento",
    icon: <Play size={10} fill="currentColor" />,
    circleClass: "bg-[#e3f2fd] text-[#1565c0]",
    badgeClass: "bg-[#e3f2fd] text-[#1565c0]",
  },
  pendente: {
    label: "pendente",
    icon: null,
    circleClass: "bg-[#fff3e0] text-[#e65100]",
    badgeClass: "bg-[#fff3e0] text-[#e65100]",
  },
};

function Cronograma() {
  const aulas = [
    { id: 1, titulo: "Aula 1 - Filosofia antiga", horario: "10h - 12h", status: "concluida" },
    { id: 2, titulo: "Aula 2- Filosofia antiga",  horario: "10h - 12h", status: "andamento" },
    { id: 3, titulo: "Aula 3- Filosofia antiga",  horario: "10h - 12h", status: "pendente" },
    { id: 4, titulo: "Aula 4- Filosofia antiga",  horario: "10h - 12h", status: "pendente" },
  ];

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-bold tracking-wide uppercase text-gray-700">Cronograma do Dia</p>

      <div className="bg-[#2d7a2d] text-white rounded-lg px-4 py-2 flex items-center justify-between text-xs font-semibold">
        <span>Hoje - Sab, 18 de abril</span>
        <span className="bg-white/20 px-3 py-0.5 rounded-full text-[11px]">{aulas.length} aulas</span>
      </div>

      <div className="flex flex-col gap-1.5">
        {aulas.map((aula, idx) => {
          const cfg = statusConfig[aula.status];
          return (
            <div key={aula.id} className="flex items-center gap-3 bg-white rounded-lg px-3 py-2.5 border border-gray-100">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${cfg.circleClass}`}>
                {cfg.icon ?? idx + 1}
              </div>
              <span className="flex-1 text-xs font-medium text-gray-700">{aula.titulo}</span>
              <span className="text-[11px] text-gray-400 mr-2">{aula.horario}</span>
              <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${cfg.badgeClass}`}>
                {cfg.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Cronograma;