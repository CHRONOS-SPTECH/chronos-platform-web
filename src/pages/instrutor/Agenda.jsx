import React from "react";
import Calendar from "lucide-react/icons/calendar";
import ChevronLeft from "lucide-react/icons/chevron-left";
import ChevronRight from "lucide-react/icons/chevron-right";

import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import { EmptyState, LoadingState } from "../../components/ui/DataState";
import AgendaGrade from "../../components/features/agenda/AgendaGrade";
import useAgendaInstrutor from "../../hooks/useAgendaInstrutor";

export default function AgendaInstrutorView() {
  const {
    semana,
    setSemana,
    datasDaSemana,
    aulas,
    carregando,
    instrutorInfo,
    semanaTexto,
    mesAnoTexto,
  } = useAgendaInstrutor();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans antialiased text-slate-800">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header
          titulo={`Minha Agenda — ${instrutorInfo.nome || "Instrutor"}`}
          icone={Calendar}
        />

        <div className="bg-white px-6 py-4 border-b border-slate-200/80 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-xs font-black bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-100/50 uppercase tracking-wider">
              Painel do Professor
            </span>
          </div>

          <div className="flex items-center gap-3 bg-slate-50/80 border border-slate-200 p-1 rounded-xl shadow-2xs">
            <button
              onClick={() => semana > 1 && setSemana(semana - 1)}
              disabled={semana <= 1}
              className="w-8 h-8 flex items-center justify-center bg-transparent border-0 cursor-pointer text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-all disabled:opacity-30"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>

            <div className="flex flex-col items-center justify-center min-w-[180px] text-center select-none px-2">
              <span className="text-xs font-black text-slate-800 tracking-tight capitalize">
                {mesAnoTexto || "Carregando..."}
              </span>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-0.5">
                {semanaTexto || "—"}
              </span>
            </div>

            <button
              onClick={() => semana < 52 && setSemana(semana + 1)}
              disabled={semana >= 52}
              className="w-8 h-8 flex items-center justify-center bg-transparent border-0 cursor-pointer text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-all disabled:opacity-30"
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {carregando ? (
            <LoadingState message="Buscando dados da agenda..." />
          ) : aulas.length > 0 ? (
            <AgendaGrade datasDaSemana={datasDaSemana} aulas={aulas} />
          ) : (
            <EmptyState title="Sem compromissos" description="Você não possui nenhuma aula agendada no sistema." />
          )}
        </div>
      </div>
    </div>
  );
}
