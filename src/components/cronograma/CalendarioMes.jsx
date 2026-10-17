import React from "react";
import { formatarDataLocal } from "../../utils/CronogramaUtils";
import { CartaoAula } from "./CalendarioGrade";

const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
export default function CalendarioMes({
  datas,
  referencia,
  obterAulasPorDataHora,
  aoSelecionar,
  selecionarData,
}) {
  return (
    <div className="overflow-hidden rounded-3xl bg-slate-200/70 p-2 shadow-xl shadow-slate-300/30 ring-1 ring-slate-300/50">
      <div className="grid grid-cols-7 overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
        {DIAS.map((dia) => (
          <div
            key={dia}
            className="p-3 text-center text-[10px] font-black uppercase tracking-wider text-indigo-100"
          >
            {dia}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 pt-1">
        {datas.map((data) => {
          const iso = formatarDataLocal(data);
          const itens = Array.from({ length: 18 }, (_, index) =>
            obterAulasPorDataHora(iso, index + 6),
          ).flat();
          const doMes = data.getMonth() === referencia.getMonth();
          return (
            <div
              role="button"
              tabIndex={0}
              key={iso}
              onClick={() => selecionarData(data)}
              onKeyDown={(e) => e.key === "Enter" && selecionarData(data)}
              className={`min-h-36 rounded-xl p-2 text-left transition hover:-translate-y-px hover:shadow-md ${doMes ? "bg-white text-slate-800 shadow-sm" : "bg-slate-100/80 text-slate-400"}`}
            >
              <span
                className={`mb-1 inline-flex h-6 min-w-6 items-center justify-center rounded-lg px-1 text-xs font-black ${doMes ? "bg-indigo-50 text-indigo-800" : "bg-slate-200 text-slate-400"}`}
              >
                {data.getDate()}
              </span>
              <span className="block space-y-1">
                {itens.slice(0, 3).map((item) => (
                  <span
                    key={item.aula.id_aula}
                    className="block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CartaoAula
                      item={item}
                      aoSelecionar={aoSelecionar}
                      arrastavel={false}
                    />
                  </span>
                ))}
              </span>
              {itens.length > 3 && (
                <span className="mt-1 block text-[10px] font-bold text-indigo-600">
                  +{itens.length - 3} aulas
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
