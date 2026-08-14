import React, { useState } from "react";
import { Calendar, Inbox, ChevronLeft, ChevronRight } from "lucide-react";

import useCronogramaAulas from "../../hooks/useCronogramaAulas";
import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/homeSecretario/Header";
import BancoPendencias from "../../components/cronograma/BancoPendencias";
import CalendarioGrade from "../../components/cronograma/CalendarioGrade";

export default function CronogramaView() {
  const [menuAberto, setMenuAberto] = useState(false);

  const {
    semana,
    setSemana,
    turmaSelecionada,
    setTurmaSelecionada,
    turmas,
    professores,
    temas,
    datas,
    pendenciasFormatadas,
    horarios,
    semanaTexto,
    mesAnoTexto,
    aoAdicionarAulaRapida,
    aoDeletarAulaPendente,
    aoDesalocar,
    aoSoltarCard,
    obterAlocacoes,
  } = useCronogramaAulas();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header titulo="Cronograma de Aulas" icone={Calendar} />

        <div className="flex-1 flex overflow-hidden relative bg-slate-50">
          <BancoPendencias
            estaAberto={menuAberto}
            aoFechar={() => setMenuAberto(false)}
            setMenuAberto={setMenuAberto}
            aulasPendentes={pendenciasFormatadas}
            aoAdicionarAulaRapida={aoAdicionarAulaRapida}
            aoDeletarAulaPendente={aoDeletarAulaPendente}
            turmas={turmas}
            turmaSelecionada={turmaSelecionada}
            professores={professores}
            temas={temas}
          />

          <main
            className="flex-1 flex flex-col overflow-hidden z-10"
            onClick={() => menuAberto && setMenuAberto(false)}
          >
            <header className="bg-white p-4 border-b shadow-sm flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuAberto(!menuAberto);
                  }}
                  className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border-0 cursor-pointer shadow-sm"
                >
                  <Inbox size={14} className="text-green-400" />
                  <span>
                    Banco de Pendências ({pendenciasFormatadas.length})
                  </span>
                </button>

                <select
                  value={turmaSelecionada}
                  onChange={(e) => setTurmaSelecionada(e.target.value)}
                  className="bg-slate-100 border border-gray-200 text-slate-700 px-3 py-2 rounded-xl font-bold text-xs outline-none cursor-pointer hover:bg-slate-200 transition-all"
                >
                  <option value="todos">Todos</option>
                  {turmas.map((turma) => (
                    <option
                      key={turma.id_turma}
                      value={turma.id_turma.toString()}
                    >
                      {turma.nome_turma} ({turma.status_turma})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 border border-gray-200 p-1.5 rounded-2xl shadow-inner">
                <button
                  onClick={() => semana > 1 && setSemana(semana - 1)}
                  className="w-8 h-8 flex items-center justify-center bg-transparent border-0 cursor-pointer text-gray-600 hover:bg-white rounded-xl transition-all"
                >
                  <ChevronLeft size={14} />
                </button>

                <div className="flex flex-col items-center min-w-[200px]">
                  <span className="text-sm font-black text-slate-800 tracking-tight leading-none capitalize">
                    {mesAnoTexto || "Carregando..."}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
                    {semanaTexto}
                  </span>
                </div>

                <button
                  onClick={() => semana < 52 && setSemana(semana + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-transparent border-0 cursor-pointer text-gray-600 hover:bg-white rounded-xl transition-all"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-auto p-6 custom-scroll">
              {horarios.length > 0 ? (
                <CalendarioGrade
                  datasDaSemana={datas}
                  listaHorarios={horarios}
                  alocacoesDoBanco={obterAlocacoes()}
                  turmaSelecionada={turmaSelecionada}
                  semanaAtual={semana}
                  aoSoltarCard={aoSoltarCard}
                  aoDesalocar={aoDesalocar}
                />
              ) : (
                <div className="text-center p-12 text-gray-400 bg-white rounded-2xl border border-dashed text-sm font-medium border-gray-300">
                  Nenhuma aula agendada para mapear os horários dessa grade.
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
