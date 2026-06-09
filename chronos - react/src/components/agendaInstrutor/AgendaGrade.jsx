import React from "react";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

export default function AgendaGrade({ datasDaSemana, aulas }) {
  const diasNome = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo",
  ];

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/70 p-5 shadow-xs overflow-x-auto scrollbar-thin">
      <div className="grid grid-cols-7 gap-4 min-w-[1400px] items-start pb-2">
        {diasNome.map((nomeDia, index) => {
          const dataObj =
            datasDaSemana && datasDaSemana[index] ? datasDaSemana[index] : null;

          const dataStringISO =
            dataObj instanceof Date && !isNaN(dataObj)
              ? dataObj.toISOString().split("T")[0]
              : null;

          const dataFormatada =
            dataObj instanceof Date && !isNaN(dataObj)
              ? `${String(dataObj.getDate()).padStart(2, "0")}/${String(dataObj.getMonth() + 1).padStart(2, "0")}`
              : "--/--";

          const aulasDoDia = aulas
            .filter(
              (item) =>
                item.aula.data_aula &&
                item.aula.data_aula.split("T")[0] === dataStringISO,
            )
            .sort((a, b) =>
              a.aula.hora_inicio.localeCompare(b.aula.hora_inicio),
            );

          return (
            <div key={nomeDia} className="flex flex-col gap-3 h-full">
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                  {nomeDia}
                </span>
                <span className="text-[10px] text-indigo-600 font-black bg-indigo-50 border border-indigo-100/40 px-2 py-0.5 rounded-md mt-1.5">
                  {dataFormatada}
                </span>
              </div>

              <div className="flex flex-col gap-2.5 min-h-[440px] rounded-xl bg-slate-50/40 p-2 border border-dashed border-slate-200">
                {aulasDoDia.length > 0 ? (
                  aulasDoDia.map((item) => (
                    <div
                      key={item.aula.id_aula}
                      className="bg-white border-y border-r border-l-[4px] border-l-indigo-500 border-slate-200/80 p-3.5 rounded-xl shadow-xs flex flex-col justify-between hover:shadow-sm transition-all text-left"
                    >
                      <div className="flex items-center justify-between gap-2 w-full">
                        <div className="flex items-center gap-1.5 text-slate-600 font-mono text-[10px] font-bold">
                          <Clock size={11} className="text-slate-400" />
                          <span>{item.aula.hora_inicio.substring(0, 5)}</span>
                        </div>
                        <span
                          className="text-[8.5px] font-black bg-slate-100 text-slate-700 border border-slate-200/60 px-1.5 py-0.5 rounded uppercase tracking-wide truncate max-w-[75px]"
                          title={item.turma.nome_turma}
                        >
                          {item.turma.nome_turma}
                        </span>
                      </div>

                      <h4
                        className="text-[11px] font-bold text-slate-800 leading-snug mt-2.5 line-clamp-3 break-words"
                        title={item.tema.titulo_tema}
                      >
                        {item.tema.titulo_tema}
                      </h4>

                      <div className="mt-3.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span
                          className="text-[9px] text-slate-400 font-semibold tracking-wide uppercase truncate max-w-[65px]"
                          title={item.materia.nome}
                        >
                          {item.materia.nome}
                        </span>

                        <div
                          className={`p-0.5 rounded-md border ${
                            item.chamadaFeita
                              ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                              : "bg-amber-50 border-amber-200 text-amber-600"
                          }`}
                        >
                          {item.chamadaFeita ? (
                            <CheckCircle size={11} strokeWidth={2.5} />
                          ) : (
                            <AlertCircle size={11} strokeWidth={2.5} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex-1 flex items-center justify-center p-4">
                    <span className="text-[10px] font-semibold text-slate-400/80 italic tracking-wide">
                      Sem aulas
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
