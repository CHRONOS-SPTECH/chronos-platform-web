import { CalendarBlank, CaretRight, Info } from "@phosphor-icons/react";

const eventos = [
  {
    id: 1,
    data: "30/03",
    ano: "2026",
    titulo: "Simpósio de Filosofia Prática",
    descricao:
      "Discussão sobre a aplicação da ética no cotidiano acadêmico e profissional.",
    tipo: "Workshop",
  },
  {
    id: 2,
    data: "02/04",
    ano: "2026",
    titulo: "Palestra: O Tempo em Cronos",
    descricao: "Entendendo os ciclos de aprendizado e a gestão de performance.",
    tipo: "Palestra",
  },
  {
    id: 2,
    data: "02/04",
    ano: "2026",
    titulo: "Palestra: O Tempo em Cronos",
    descricao: "Entendendo os ciclos de aprendizado e a gestão de performance.",
    tipo: "Palestra",
  },
  {
    id: 2,
    data: "02/04",
    ano: "2026",
    titulo: "Palestra: O Tempo em Cronos",
    descricao: "Entendendo os ciclos de aprendizado e a gestão de performance.",
    tipo: "Palestra",
  },
];

function Evento() {
  return (
    <section className="flex flex-col w-full animate-fade-in">
      <h3 className="text-xs font-black tracking-[0.2em] text-slate-400 uppercase mb-4 ml-1">
        Próximos Eventos
      </h3>

      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        {/* Header da Semana */}
        <div className="bg-[#1E7A3C] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <CalendarBlank size={18} weight="bold" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Semana Atual
            </span>
          </div>
          <span className="text-[10px] font-bold text-green-100 bg-white/10 px-2 py-1 rounded-md uppercase">
            29/03 — 05/04
          </span>
        </div>

        {/* Lista de Eventos */}
        <div className="p-2 flex flex-col gap-2">
          {eventos.map((ev, index) => (
            <button
              key={ev.id}
              className={`group flex items-center gap-4 p-3 rounded-[18px] transition-all text-left
                ${
                  index === 0
                    ? "bg-green-50/50 border border-green-100 shadow-sm"
                    : "hover:bg-slate-50 border border-transparent"
                }`}
            >
              {/* Data Estilo Calendário */}
              <div
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl flex-shrink-0 transition-transform group-hover:scale-105
                ${index === 0 ? "bg-[#1E7A3C] text-white" : "bg-slate-100 text-slate-500"}`}
              >
                <span className="text-[10px] font-black uppercase leading-none mb-1 opacity-80">
                  {ev.ano}
                </span>
                <span className="text-sm font-black leading-none">
                  {ev.data}
                </span>
              </div>

              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md
                    ${index === 0 ? "bg-green-200/40 text-[#1E7A3C]" : "bg-slate-200/50 text-slate-500"}`}
                  >
                    {ev.tipo}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-[#1E7A3C] transition-colors">
                  {ev.titulo}
                </h4>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                  {ev.descricao}
                </p>
              </div>

              {/* Ícone de Ação */}
              <div className="text-slate-300 group-hover:text-[#1E7A3C] transition-colors pr-1">
                <CaretRight size={16} weight="bold" />
              </div>
            </button>
          ))}
        </div>

        {/* Footer do Card */}
        <button className="w-full py-3 bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 transition-colors border-t border-slate-100">
          Ver todos os eventos
        </button>
      </div>
    </section>
  );
}

export default Evento;
