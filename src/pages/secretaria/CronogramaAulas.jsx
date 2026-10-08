import React, { useState } from "react";
import { Calendar, Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import useCronogramaAulas from "../../hooks/useCronogramaAulas";
import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/homeSecretario/Header";
import BancoPendencias from "../../components/cronograma/BancoPendencias";
import CalendarioGrade from "../../components/cronograma/CalendarioGrade";
import CalendarioMes from "../../components/cronograma/CalendarioMes";
import AulaDialog from "../../components/cronograma/AulaDialog";
import ConfirmDialog from "../../components/common/ConfirmDialog";

export default function CronogramaView() {
  const [menuAberto, setMenuAberto] = useState(false);
  const agenda = useCronogramaAulas();
  const {
    dataReferencia,
    visualizacao,
    setVisualizacao,
    turmaSelecionada,
    setTurmaSelecionada,
    instrutorSelecionado,
    setInstrutorSelecionado,
    filtroPresenca,
    setFiltroPresenca,
    turmas,
    professores,
    temas,
    datas,
    datasSemana,
    pendenciasFormatadas,
    semanaTexto,
    mesAnoTexto,
    aoAdicionarAulaRapida,
    aoDeletarAulaPendente,
    aoDesalocar,
    aoSoltarCard,
    obterAulasPorDataHora,
    navegarPeriodo,
    selecionarData,
    hoje,
    confirmacao,
    setConfirmacao,
    confirmarRemanejamento,
    aulaSelecionada,
    setAulaSelecionada,
    aulaEmEdicao,
    setAulaEmEdicao,
    salvarEdicao,
    carregando,
  } = agenda;
  const aulasNaSubstituicao = confirmacao?.ocupantes || [];
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <Header titulo="Cronograma de Aulas" icone={Calendar} />
        <div className="relative flex min-h-0 flex-1 overflow-hidden">
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
            className="flex min-w-0 flex-1 flex-col overflow-hidden bg-slate-100"
            onClick={() => menuAberto && setMenuAberto(false)}
          >
            <header className="mx-5 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/90 p-3 shadow-md shadow-slate-300/25 ring-1 ring-slate-200/70">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuAberto(!menuAberto);
                  }}
                  className="flex h-9 items-center gap-2 rounded-xl bg-indigo-950 px-3 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <Inbox size={14} className="text-emerald-400" />
                  Pendências ({pendenciasFormatadas.length})
                </button>
                <select
                  aria-label="Filtrar por turma"
                  value={turmaSelecionada}
                  onChange={(e) => setTurmaSelecionada(e.target.value)}
                  className="h-9 min-w-36 rounded-xl border-0 bg-slate-100 px-3 text-xs font-semibold text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-indigo-300"
                >
                  <option value="todos">Todas as turmas</option>
                  {turmas.map((t) => (
                    <option key={t.id_turma} value={String(t.id_turma)}>
                      {t.nome_turma}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Filtrar por instrutor"
                  value={instrutorSelecionado}
                  onChange={(e) => setInstrutorSelecionado(e.target.value)}
                  className="h-9 min-w-40 rounded-xl border-0 bg-slate-100 px-3 text-xs font-semibold text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-indigo-300"
                >
                  <option value="todos">Todos os instrutores</option>
                  {professores.map((p) => (
                    <option key={p.id_pessoa} value={String(p.id_pessoa)}>
                      {p.nome}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Filtrar por presença"
                  value={filtroPresenca}
                  onChange={(e) => setFiltroPresenca(e.target.value)}
                  className="h-9 min-w-36 rounded-xl border-0 bg-slate-100 px-3 text-xs font-semibold text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-indigo-300"
                >
                  <option value="todas">Todas as chamadas</option>
                  <option value="feita">Presença feita</option>
                  <option value="pendente">Presença pendente</option>
                </select>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex rounded-xl bg-slate-100 p-1">
                  <button
                    onClick={() => setVisualizacao("semana")}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${visualizacao === "semana" ? "bg-white text-indigo-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    Semana
                  </button>
                  <button
                    onClick={() => setVisualizacao("mes")}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${visualizacao === "mes" ? "bg-white text-indigo-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    Mês
                  </button>
                </div>
                <button
                  onClick={hoje}
                  className="h-9 rounded-xl bg-indigo-50 px-3 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  Hoje
                </button>
                <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
                  <button
                    aria-label="Período anterior"
                    onClick={() => navegarPeriodo(-1)}
                    className="rounded-lg p-2 text-slate-600 transition hover:bg-white hover:text-indigo-700"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <div className="min-w-36 text-center">
                    <span className="block text-xs font-black capitalize text-slate-800">
                      {mesAnoTexto}
                    </span>
                    <span className="block text-[10px] text-slate-500">
                      {visualizacao === "semana"
                        ? semanaTexto
                        : `${dataReferencia.getFullYear()}`}
                    </span>
                  </div>
                  <button
                    aria-label="Próximo período"
                    onClick={() => navegarPeriodo(1)}
                    className="rounded-lg p-2 text-slate-600 transition hover:bg-white hover:text-indigo-700"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </header>
            <div className={`min-h-0 flex-1 px-5 pb-5 pt-3 ${visualizacao === "semana" ? "overflow-hidden" : "overflow-auto"}`}>
              {carregando && (
                <p className="mb-2 text-xs text-slate-500">
                  Atualizando aulas…
                </p>
              )}
              {visualizacao === "semana" ? (
                <div className="h-full min-h-[420px] overflow-hidden rounded-3xl">
                <CalendarioGrade
                  datasDaSemana={datasSemana}
                  obterAulasPorDataHora={obterAulasPorDataHora}
                  aoSoltarCard={aoSoltarCard}
                  aoSelecionar={setAulaSelecionada}
                  aoDesalocar={aoDesalocar}
                />
                </div>
              ) : (
                <CalendarioMes
                  datas={datas}
                  referencia={dataReferencia}
                  obterAulasPorDataHora={obterAulasPorDataHora}
                  aoSelecionar={setAulaSelecionada}
                  selecionarData={selecionarData}
                />
              )}
            </div>
          </main>
        </div>
        <AulaDialog
          item={aulaSelecionada}
          editando={Boolean(aulaEmEdicao)}
          onClose={() => {
            setAulaSelecionada(null);
            setAulaEmEdicao(null);
          }}
          onEditar={() => setAulaEmEdicao(aulaSelecionada)}
          onSalvar={salvarEdicao}
          turmas={turmas}
          professores={professores}
          temas={temas}
        />
        <ConfirmDialog
          aberto={Boolean(confirmacao)}
          titulo="Substituir aula neste horário?"
          mensagem={
            aulasNaSubstituicao.length
              ? `A aula ${aulasNaSubstituicao.map((item) => item.tema?.titulo_tema || `#${item.aula.id_aula}`).join(", ")} voltará para as pendências. A nova aula será alocada no horário selecionado.`
              : "Confirmar alocação da aula neste horário?"
          }
          onConfirm={confirmarRemanejamento}
          onCancel={() => setConfirmacao(null)}
          confirmText="Confirmar alocação"
        />
      </div>
    </div>
  );
}
