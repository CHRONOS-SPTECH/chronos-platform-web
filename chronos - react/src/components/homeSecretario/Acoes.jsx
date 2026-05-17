import React from "react";

// 1. Definimos a estrutura esperada para cada ação
// item: { id, label, subLabel, icon: IconComponent, onClick, isPrimary }

function Acoes({ acoes = [] }) {
  if (acoes.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      <p className="text-xs font-black tracking-[0.2em] text-slate-400 uppercase ml-1">
        Ações Rápidas
      </p>

      {/* Grid principal */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {acoes.map((acao) => {
          const Icone = acao.icon;

          // Se for o botão principal (Destaque verde)
          if (acao.isPrimary) {
            return (
              <button
                key={acao.id}
                onClick={acao.onClick}
                className="md:col-span-2 group relative overflow-hidden bg-[#1E7A3C] hover:bg-[#165a2d] text-white p-6 rounded-3xl transition-all shadow-xl shadow-green-100/50 flex items-center gap-5 active:scale-[0.98]"
              >
                <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
                  {Icone && <Icone size={24} weight="fill" />}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-lg font-black tracking-tight leading-none">
                    {acao.label}
                  </span>
                  {acao.subLabel && (
                    <span className="text-green-200 text-xs mt-1 font-medium italic">
                      {acao.subLabel}
                    </span>
                  )}
                </div>
              </button>
            );
          }

          // Se for um botão secundário (Branco/Cinza)
          return (
            <button
              key={acao.id}
              onClick={acao.onClick}
              className="bg-white border border-slate-100 hover:border-green-200 p-6 rounded-3xl transition-all flex flex-col gap-4 items-start group shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              <div className="p-3 bg-slate-50 group-hover:bg-green-50 text-slate-400 group-hover:text-[#1E7A3C] rounded-xl transition-all">
                {Icone && <Icone size={20} weight="bold" />}
              </div>
              <span className="text-sm font-bold text-slate-700 leading-none">
                {acao.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Acoes;
