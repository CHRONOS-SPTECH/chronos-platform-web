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
  const diasDaSemanaNome = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo",
  ];

  const [quadradoAtivo, setQuadradoAtivo] = useState(null);

  const coresDosCards = {
    emerald:
      "bg-emerald-600 hover:bg-emerald-700 border-emerald-500 text-white",
    indigo: "bg-indigo-600 hover:bg-indigo-700 border-indigo-500 text-white",
    rose: "bg-rose-600 hover:bg-rose-700 border-rose-500 text-white",
    amber: "bg-amber-600 hover:bg-amber-700 border-amber-500 text-white",
  };

  const quandoPassarPorCima = (evento, chaveEspecifica) => {
    evento.preventDefault();
    setQuadradoAtivo(chaveEspecifica);
  };

  const quandoSairDeCima = () => {
    setQuadradoAtivo(null);
  };

  const quandoSoltarNoQuadrado = (
    evento,
    numeroDia,
    textoHora,
    chaveEspecifica,
  ) => {
    evento.preventDefault();
    setQuadradoAtivo(null);
    aoSoltarCard(evento, numeroDia, textoHora, chaveEspecifica);
  };

  const quandoComecarArrastarCard = (evento, dadosDaAula, chaveEspecifica) => {
    evento.dataTransfer.setData("text/plain", dadosDaAula.id_aula.toString());
    evento.dataTransfer.setData("chaveAntiga", chaveEspecifica);
    evento.dataTransfer.setData("origem", "calendario");
  };

  return (
    <div className="min-w-[1200px] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      <div className="grid grid-cols-[100px_repeat(7,1fr)] bg-gray-50/50 border-b border-gray-200">
        <div className="h-12 border-r border-gray-200 bg-gray-50/50"></div>
        {diasDaSemanaNome.map((nomeDia, indice) => {
          const objetoData = datasDaSemana[indice];
          const dataFormatada = objetoData
            ? `${String(objetoData.getDate()).padStart(2, "0")}/${String(objetoData.getMonth() + 1).padStart(2, "0")}`
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

      <div className="grid grid-cols-[100px_repeat(7,1fr)] bg-white">
        {listaHorarios.map((horario) => (
          <React.Fragment key={horario}>
            <div className="h-24 flex flex-col items-center justify-center border-b border-r border-gray-200 bg-gray-50/40 font-mono text-xs text-gray-400 font-bold">
              {horario}
            </div>

            {[1, 2, 3, 4, 5, 6, 7].map((diaNumero) => {
              const chaveIdentificadora = `${turmaSelecionada}_${semanaAtual}_${diaNumero}_${horario}`;
              const aulaExistente = alocacoesDoBanco[chaveIdentificadora];
              const oCardEstaPassandoPorCima =
                quadradoAtivo === chaveIdentificadora;

              const estiloDoCard = aulaExistente
                ? coresDosCards[aulaExistente.color] ||
                  "bg-slate-600 text-white"
                : "";

              return (
                <div
                  key={diaNumero}
                  onDragOver={(evento) =>
                    quandoPassarPorCima(evento, chaveIdentificadora)
                  }
                  onDragLeave={quandoSairDeCima}
                  onDrop={(evento) =>
                    quandoSoltarNoQuadrado(
                      evento,
                      diaNumero,
                      horario,
                      chaveIdentificadora,
                    )
                  }
                  style={{ minHeight: "96px" }}
                  className={`p-2 border-b border-r border-gray-200/70 transition-all duration-150 relative ${
                    oCardEstaPassandoPorCima
                      ? "bg-green-50/80 border-2 border-dashed border-green-500 z-10"
                      : "bg-white"
                  }`}
                >
                  {aulaExistente ? (
                    <div
                      draggable
                      onDragStart={(evento) =>
                        quandoComecarArrastarCard(
                          evento,
                          aulaExistente,
                          chaveIdentificadora,
                        )
                      }
                      className={`${estiloDoCard} p-3 rounded-xl shadow-sm border h-full w-full cursor-move flex flex-col justify-between transition-all text-left`}
                    >
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-wider bg-white/20 px-1.5 py-0.5 rounded w-max">
                          Prof. {aulaExistente.prof}
                        </p>
                        <p className="text-xs font-bold leading-snug mt-2 break-words">
                          {aulaExistente.tema}
                        </p>
                      </div>

                      <div className="flex justify-end text-[9px] mt-1 opacity-75 hover:opacity-100 transition-all">
                        <button
                          onClick={(evento) => {
                            evento.stopPropagation();
                            aoDesalocar(chaveIdentificadora);
                          }}
                          className="hover:text-red-100 flex items-center gap-1 cursor-pointer border-0 bg-transparent text-white font-semibold"
                        >
                          <Reply size={10} /> Desalocar
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
