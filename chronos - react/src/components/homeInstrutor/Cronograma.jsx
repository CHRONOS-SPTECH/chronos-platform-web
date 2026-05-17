import { Check, Play, Clock } from "@phosphor-icons/react";

function Cronograma() {
  const aulas = [
    {
      id: 1,
      titulo: "Aula 1 - Filosofia antiga",
      horario: "10h - 12h",
      status: "concluida",
    },
    {
      id: 2,
      titulo: "Aula 2 - Filosofia antiga",
      horario: "14h - 16h",
      status: "andamento",
    },
    {
      id: 3,
      titulo: "Aula 3 - Filosofia antiga",
      horario: "16h - 18h",
      status: "pendente",
    },
  ];

  return (
    <div className="flex flex-col w-full animate-fade-in">
      <p className="text-xs font-black tracking-[0.2em] text-slate-400 uppercase mb-3 ml-1">
        Cronograma do Dia
      </p>

      {/* Header Estilo Tabela Verde */}
      <div className="bg-[#1E7A3C] text-white rounded-t-2xl px-6 py-4 flex items-center justify-between shadow-lg shadow-green-900/10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold tracking-tight">
            Sábado, 18 de Abril
          </span>
        </div>
        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider">
          {aulas.length} aulas
        </span>
      </div>

      {/* Lista Estilo Tabela */}
      <div className="bg-white border-x border-b border-slate-100 rounded-b-2xl overflow-hidden shadow-sm">
        {aulas.map((aula, idx) => (
          <div
            key={aula.id}
            className="flex items-center gap-4 px-6 py-4 border-b border-slate-50 last:border-none hover:bg-slate-50/50 transition-colors group"
          >
            {/* Indicador de Status Compacto */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110
              ${
                aula.status === "concluida"
                  ? "bg-emerald-50 text-emerald-600"
                  : aula.status === "andamento"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-slate-50 text-slate-400"
              }`}
            >
              {aula.status === "concluida" ? (
                <Check size={16} weight="bold" />
              ) : aula.status === "andamento" ? (
                <Play size={14} weight="fill" />
              ) : (
                <span className="text-xs font-bold">{idx + 1}</span>
              )}
            </div>

            <span className="flex-1 text-sm font-bold text-slate-700 tracking-tight">
              {aula.titulo}
            </span>

            <div className="flex items-center gap-4">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <Clock size={14} /> {aula.horario}
              </span>
              <span
                className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border
                ${
                  aula.status === "concluida"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : aula.status === "andamento"
                      ? "bg-blue-50 text-blue-600 border-blue-100 animate-pulse"
                      : "bg-slate-50 text-slate-400 border-slate-100"
                }`}
              >
                {aula.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Cronograma;
