import { Play, Calendar, Users } from "@phosphor-icons/react";

function Acoes() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <p className="text-xs font-black tracking-[0.2em] text-slate-400 uppercase ml-1">
        Ações Rápidas
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Botão Principal: Grande (ocupa 2 colunas) */}
        <button className="md:col-span-2 group relative overflow-hidden bg-[#1E7A3C] hover:bg-[#165a2d] text-white p-6 rounded-3xl transition-all shadow-xl shadow-green-100/50 flex items-center gap-5 active:scale-[0.98]">
          <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
            <Play size={24} weight="fill" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-lg font-black tracking-tight leading-none">
              Marcar Presença
            </span>
            <span className="text-green-200 text-xs mt-1 font-medium italic">
              Aula em andamento agora
            </span>
          </div>
        </button>

        {/* Botões Secundários: Menores (ocupam 1 coluna cada) */}
        <button className="bg-white border border-slate-100 hover:border-green-200 p-6 rounded-3xl transition-all flex flex-col gap-4 items-start group shadow-sm hover:shadow-md active:scale-[0.98]">
          <div className="p-3 bg-slate-50 group-hover:bg-green-50 text-slate-400 group-hover:text-[#1E7A3C] rounded-xl transition-all">
            <Calendar size={20} weight="bold" />
          </div>
          <span className="text-sm font-bold text-slate-700 leading-none">
            Minha Agenda
          </span>
        </button>

        <button className="bg-white border border-slate-100 hover:border-green-200 p-6 rounded-3xl transition-all flex flex-col gap-4 items-start group shadow-sm hover:shadow-md active:scale-[0.98]">
          <div className="p-3 bg-slate-50 group-hover:bg-green-50 text-slate-400 group-hover:text-[#1E7A3C] rounded-xl transition-all">
            <Users size={20} weight="bold" />
          </div>
          <span className="text-sm font-bold text-slate-700 leading-none">
            Minhas Turmas
          </span>
        </button>
      </div>
    </div>
  );
}

export default Acoes;
