import React, { useState } from "react";
import { Reply } from "lucide-react";

export default function CalendarioGrade({
  datasDaSemana,
  listaHorarios,
  alocacoesDoBanco,
  turmaSelecionada,
  semanaAtual,
  aoSoltarCard,
  aoDesalocar,
}) {
  const dias = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo",
  ];
  const [quadradoAtivo, setQuadradoAtivo] = useState(null);

  const coresStatus = {
    emerald: {
      borda: "border-l-emerald-500",
      tagProf: "bg-emerald-50 text-emerald-700 border-emerald-200",
      btnDesalocar: "text-emerald-600 hover:bg-emerald-50",
    },
    indigo: {
      borda: "border-l-indigo-500",
      tagProf: "bg-indigo-50 text-indigo-700 border-indigo-200",
      btnDesalocar: "text-indigo-600 hover:bg-indigo-50",
    },
    rose: {
      borda: "border-l-rose-500",
      tagProf: "bg-rose-50 text-rose-700 border-rose-200",
      btnDesalocar: "text-rose-600 hover:bg-rose-50",
    },
    amber: {
      borda: "border-l-amber-500",
      tagProf: "bg-amber-50 text-amber-700 border-amber-200",
      btnDesalocar: "text-amber-600 hover:bg-amber-50",
    },
  };

  const arrastarPorCima = (e, chave) => {
    e.preventDefault();
    setQuadradoAtivo(chave);
  };

  const soltarNoQuadrado = (e, diaNum, horario, chaveCelular) => {
    e.preventDefault();
    setQuadradoAtivo(null);
    aoSoltarCard(e, diaNum, horario, chaveCelular);
  };

  const comecarArrastar = (e, aula, chaveReal) => {
    e.dataTransfer.setData("text/plain", aula.id_aula.toString());
    e.dataTransfer.setData("chaveAntiga", chaveReal);
    e.dataTransfer.setData("origem", "calendario");
  };

  const buscarAulaNaCelula = (diaNum, horario) => {
    if (turmaSelecionada !== "todos") {
      const chavePadrao = `${turmaSelecionada}_${semanaAtual}_${diaNum}_${horario}`;
      return {
        aula: alocacoesDoBanco[chavePadrao],
        chaveReal: chavePadrao,
        idTurmaReal: turmaSelecionada,
      };
    }

    const sufixoProcurado = `_${semanaAtual}_${diaNum}_${horario}`;
    const chaveEncontrada = Object.keys(alocacoesDoBanco).find((key) =>
      key.endsWith(sufixoProcurado),
    );

    let idTurmaReal = "";
    if (chaveEncontrada) {
      idTurmaReal = chaveEncontrada.split("_")[0];
    }

    return {
      aula: chaveEncontrada ? alocacoesDoBanco[chaveEncontrada] : null,
      chaveReal: chaveEncontrada || `todos_${semanaAtual}_${diaNum}_${horario}`,
      idTurmaReal,
    };
  };

  return (
    <div className="min-w-[1200px] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      <div className="grid grid-cols-[100px_repeat(7,1fr)] bg-gray-50/50 border-b border-gray-200">
        <div className="h-12 border-r border-gray-200 bg-gray-50/50"></div>
        {dias.map((nomeDia, index) => {
          const dataObj = datasDaSemana[index];
          const dataFormatada = dataObj
            ? `${String(dataObj.getDate()).padStart(2, "0")}/${String(
                dataObj.getMonth() + 1,
              ).padStart(2, "0")}`
            : "--/--";

          return (
            <div
              key={nomeDia}
              className="flex flex-col items-center justify-center py-2 bg-transparent border-r border-gray-200 last:border-r-0"
            >
              <span className="font-bold text-gray-700 text-[11px] uppercase tracking-wider">
                {nomeDia}
              </span>
              <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded-md mt-0.5">
                {dataFormatada}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-[100px_repeat(7,1fr)] bg-white items-stretch">
        {listaHorarios.map((horario) => (
          <React.Fragment key={horario}>
            <div className="flex flex-col items-center justify-center border-b border-r border-gray-200 bg-gray-50/40 font-mono text-xs text-gray-400 font-bold p-2 min-h-[112px]">
              {horario}
            </div>

            {[1, 2, 3, 4, 5, 6, 7].map((diaNum) => {
              const { aula, chaveReal, idTurmaReal } = buscarAulaNaCelula(
                diaNum,
                horario,
              );
              const chaveMockDrop = `${turmaSelecionada}_${semanaAtual}_${diaNum}_${horario}`;
              const estaAtivo = quadradoAtivo === chaveMockDrop;

              const estiloConfig = aula
                ? coresStatus[aula.color] || {
                    borda: "border-l-slate-400",
                    tagProf: "bg-slate-50 text-slate-700 border-slate-200",
                    btnDesalocar: "text-slate-600 hover:bg-slate-50",
                  }
                : null;

              return (
                <div
                  key={diaNum}
                  onDragOver={(e) => arrastarPorCima(e, chaveMockDrop)}
                  onDragLeave={() => setQuadradoAtivo(null)}
                  onDrop={(e) =>
                    soltarNoQuadrado(e, diaNum, horario, chaveReal)
                  }
                  className={`p-2 border-b border-r border-gray-200/70 transition-all duration-150 flex flex-col min-h-[112px] justify-between ${
                    estaAtivo
                      ? "bg-green-50/60 border-2 border-dashed border-green-400 z-10"
                      : "bg-white"
                  }`}
                >
                  {aula ? (
                    <div
                      draggable
                      onDragStart={(e) => comecarArrastar(e, aula, chaveReal)}
                      className={`bg-white border-y border-r border-l-[5px] ${estiloConfig.borda} border-gray-200 p-2.5 rounded-xl shadow-sm flex-1 w-full cursor-move flex flex-col justify-between transition-all group hover:shadow-md text-left overflow-hidden`}
                    >
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex gap-1 flex-wrap items-center">
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wide border px-1.5 py-0.5 rounded truncate max-w-full ${estiloConfig.tagProf}`}
                          >
                            {aula.prof}
                          </span>
                          {turmaSelecionada === "todos" && idTurmaReal && (
                            <span className="text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded">
                              Turma {aula.turma}
                            </span>
                          )}
                        </div>

                        <p
                          className="text-xs font-bold text-slate-800 leading-snug mt-1.5 break-all sm:break-words"
                          title={aula.tema}
                        >
                          {aula.tema}
                        </p>
                      </div>

                      <div className="flex justify-end mt-2 pt-1 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            aoDesalocar(chaveReal);
                          }}
                          className={`flex items-center gap-1 cursor-pointer border-0 bg-transparent font-bold text-[10px] py-1 px-1.5 rounded-md transition-colors ${estiloConfig.btnDesalocar}`}
                        >
                          <Reply size={11} className="transform rotate-180" />
                          <span>Desalocar</span>
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
