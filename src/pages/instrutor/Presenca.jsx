import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ClipboardList from "lucide-react/icons/clipboard-list";
import CalendarDays from "lucide-react/icons/calendar-days";
import Clock from "lucide-react/icons/clock";
import GraduationCap from "lucide-react/icons/graduation-cap";
import ArrowLeft from "lucide-react/icons/arrow-left";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import CardPresenca from "../../components/features/presenca/CardPresenca";
import usePresenca from "../../hooks/usePresenca";
import { LoadingState } from "../../components/ui/DataState";
import { parseDataLocal } from "../../utils/CronogramaUtils";

function Presenca() {
  const { idTurma: identificadorTurma, idAula: identificadorAula } =
    useParams();
  const navigate = useNavigate();

  const {
    usuario,
    turma,
    aula,
    alunos,
    pagina,
    setPagina,
    paginacao,
    carregando,
    error,
    alternarPresenca,
    salvarChamada,
  } = usePresenca({
    idTurma: identificadorTurma,
    idAula: identificadorAula,
  });
  const chamadaConcluida = Boolean(
    aula?.chamadaFeita ?? aula?.aula?.chamadaFeita,
  );
  const dataAula = parseDataLocal(aula?.aula?.data_aula);

  if (carregando) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC] p-6">
        <div className="w-full max-w-lg"><LoadingState message="Carregando chamada..." /></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          titulo="Registro de Presença"
          icone={ClipboardList}
          usuario={{ nome: usuario?.nome || "Instrutor", cargo: "Instrutor" }}
        />

        <main className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
          {/* Ações de Navegação */}
          <div className="px-8 pt-4">
            <button
              onClick={() => navigate("/minha-agenda")}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 transition-colors group"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
              Voltar para a agenda
            </button>
          </div>

          {/* Barra de Resumo do Contexto da Aula */}
          <div className="px-8 py-5 border-b border-slate-100 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300 mt-2">
            <div className="flex flex-wrap items-center gap-6">
              {/* Turma e Matéria */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl">
                <div className="p-1.5 bg-green-50 text-[#1E7A3C] rounded-lg">
                  <GraduationCap size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                    Turma / Matéria
                  </span>
                  <span className="text-xs font-black text-slate-700 mt-0.5">
                    {turma?.nome_turma || "Sem Turma"} -{" "}
                    {aula?.materia?.nome || "Sem Matéria"}
                  </span>
                </div>
              </div>

              {/* Data de Início */}
              <div className="flex items-center gap-3">
                <CalendarDays size={18} className="text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                    Data da aula
                  </span>
                  <span className="text-xs font-bold text-slate-600 mt-0.5">
                    {dataAula
                      ? dataAula.toLocaleDateString(
                          "pt-BR",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          },
                        )
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div className="hidden md:block w-px h-6 bg-slate-200"></div>

              {/* Horário da Aula */}
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                    Horário da Aula
                  </span>
                  <span className="text-xs font-bold text-slate-600 mt-0.5">
                    {aula?.aula
                      ? `${aula.aula.hora_inicio.slice(0, 5)}h - ${aula.aula.hora_fim.slice(0, 5)}h`
                      : "00:00 - 00:00"}
                  </span>
                </div>
              </div>
            </div>

            {/* Status do Registro */}
            <div className="flex items-center gap-3">
              <span
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-wider ${
                  chamadaConcluida
                    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                    : "border-amber-100 bg-amber-50 text-amber-700"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    chamadaConcluida ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                {chamadaConcluida ? "Chamada realizada" : "Chamada pendente"}
              </span>
            </div>
          </div>

          {/* Listagem de Alunos / Formulário de Chamada */}
          <div className="p-8 flex-1">
            {!alunos || alunos.length === 0 ? (
              <div className="text-center py-12 text-sm text-slate-400 font-medium bg-white rounded-2xl border border-slate-100 shadow-sm">
                Nenhum aluno matriculado nesta turma.
              </div>
            ) : (
              <>
                {chamadaConcluida && (
                  <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                    Você está consultando uma chamada já realizada. As presenças não podem ser alteradas.
                  </div>
                )}
                <CardPresenca
                  alunos={alunos}
                  dadosAula={aula}
                  onTogglePresenca={alternarPresenca}
                  onSalvarChamada={salvarChamada}
                  carregando={carregando}
                  pagina={pagina}
                  paginacao={paginacao}
                  onMudarPagina={setPagina}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Presenca;
