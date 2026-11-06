import { useState } from "react";
import BookOpen from "lucide-react/icons/book-open";
import Plus from "lucide-react/icons/plus";
import Search from "lucide-react/icons/search";
import SlidersHorizontal from "lucide-react/icons/sliders-horizontal";
import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/homeSecretario/Header";
import ModulosControle from "../../components/turmas/ModuloControle";
import CardTurma from "../../components/turmas/CardTurma";
import ModalTurma from "../../components/turmas/ModalTurma";
import useTurmas from "../../hooks/useTurmas";
import { useToast } from "../../components/alert-toast/ToastProvider";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import ModalAlunosPorTurma from "../../components/turmas/ModalTurmaAlunos";
import turmaService from "../../services/turmaService";
import ModalMatriculas from "../../components/turmas/ModalMatriculas";
import ModalDetalhesTurma from "../../components/turmas/ModalDetalhesTurma";
import ModalFormandos from "../../components/turmas/ModalFormandos";
import LoaderCircle from "lucide-react/icons/loader-circle";
import RefreshCw from "lucide-react/icons/refresh-cw";

function CartaoCarregando({ indice }) {
  const cabecalhos = [
    "from-sky-700 to-indigo-950",
    "from-emerald-700 to-teal-950",
    "from-violet-700 to-indigo-950",
  ];
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm"
    >
      <div
        className={`relative h-[150px] animate-pulse bg-gradient-to-br ${cabecalhos[indice % cabecalhos.length]} p-5`}
      >
        <div className="flex justify-between">
          <span className="size-11 rounded-2xl bg-white/20" />
          <span className="h-6 w-24 rounded-full bg-white/20" />
        </div>
        <div className="mt-5 h-5 w-3/4 rounded bg-white/20" />
        <div className="mt-3 h-3 w-1/2 rounded bg-white/15" />
      </div>
      <div className="animate-pulse p-5">
        <div className="flex justify-between">
          <span className="h-3 w-28 rounded bg-slate-100" />
          <span className="h-4 w-10 rounded bg-slate-100" />
        </div>
        <div className="mt-3 h-2 rounded-full bg-slate-100" />
        <div className="mt-5 flex justify-between">
          <span className="h-7 w-28 rounded-lg bg-slate-100" />
          <span className="h-7 w-16 rounded-lg bg-slate-100" />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
          <span className="col-span-2 h-10 rounded-xl bg-slate-100" />
          <span className="h-10 rounded-xl bg-slate-100" />
          <span className="h-10 rounded-xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export default function Turmas() {
  const toast = useToast();
  const [isModalAberto, setIsModalAberto] = useState(false);
  const [isModalAbertoAlunosTurma, setIsModalAbertoAlunosTurma] =
    useState(false);
  const [turmaDetalhes, setTurmaDetalhes] = useState(null);
  const [turmaParaMatricula, setTurmaParaMatricula] = useState(null);
  const [mostrarSeletorTurma, setMostrarSeletorTurma] = useState(false);
  const [turmaFormandos, setTurmaFormandos] = useState(null);
  const [turmaEmEdicao, setTurmaEmEdicao] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [turmaParaExcluir, setTurmaParaExcluir] = useState(null);
  const [carregandoAlunos, setCarregandoAlunos] = useState(false);
  const [erroAlunos, setErroAlunos] = useState("");
  const [paginaAlunos, setPaginaAlunos] = useState(0);
  const [idTurmaAlunos, setIdTurmaAlunos] = useState(null);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todas");

  const {
    turmasUi,
    loading,
    error,
    salvando,
    dadosAlunosPorTurma,
    salvarTurma,
    excluirTurma,
    buscarAlunos,
    carregarTurmas,
  } = useTurmas();

  const turmasFiltradas = turmasUi.filter((turma) => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    const correspondeBusca =
      !termo ||
      String(turma.nome || "")
        .toLocaleLowerCase("pt-BR")
        .includes(termo);
    const correspondeStatus =
      filtroStatus === "Todas" || turma.status === filtroStatus;
    return correspondeBusca && correspondeStatus;
  });

  const onNovaTurma = () => {
    setTurmaEmEdicao(null);
    setIsModalAberto(true);
  };

  const onEditarTurma = (turma) => {
    setTurmaEmEdicao(turma.raw);
    setIsModalAberto(true);
  };

  const onVer = async (turma) => {
    setPaginaAlunos(0);
    setIdTurmaAlunos(turma.id);
    setIsModalAbertoAlunosTurma(true);
    setCarregandoAlunos(true);
    setErroAlunos("");
    try {
      await buscarAlunos(turma.id, 0);
    } catch (err) {
      setErroAlunos(
        err?.response?.data?.message ||
          "Não foi possível carregar os alunos desta turma.",
      );
    } finally {
      setCarregandoAlunos(false);
    }
  };

  const abrirAlunos = (turma) => {
    setTurmaDetalhes(null);
    onVer(turma);
  };

  const mudarPaginaAlunos = async (pagina) => {
    if (
      pagina < 0 ||
      !idTurmaAlunos ||
      pagina >= (dadosAlunosPorTurma?.total_paginas ?? Infinity)
    )
      return;
    setPaginaAlunos(pagina);
    setCarregandoAlunos(true);
    setErroAlunos("");
    try {
      await buscarAlunos(idTurmaAlunos, pagina);
    } catch (err) {
      setErroAlunos(
        err?.response?.data?.message ||
          "Não foi possível carregar os alunos desta turma.",
      );
    } finally {
      setCarregandoAlunos(false);
    }
  };

  const onSalvarTurma = async (dadosTurma) => {
    try {
      await salvarTurma(dadosTurma, turmaEmEdicao);
      toast.success("Turma salva com sucesso!");
      setIsModalAberto(false);
      setTurmaEmEdicao(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Erro ao salvar turma.");
    }
  };

  const executarAcaoStatus = async (turma, acao) => {
    if (acao === "encerrar") {
      setTurmaParaExcluir(turma);
      setAcaoPendente("encerrar");
      setConfirmOpen(true);
      return;
    }
    try {
      const servico = {
        iniciar: "iniciarTurma",
        encerrar: "encerrarTurma",
        inativar: "inativarTurma",
      }[acao];
      await turmaService[servico](turma.id);
      await carregarTurmas();
      toast.success(
        acao === "iniciar"
          ? "Turma iniciada."
          : acao === "encerrar"
            ? "Turma encerrada. Avaliações pendentes foram criadas."
            : "Turma inativada.",
      );
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Não foi possível alterar o status da turma.",
      );
    }
  };

  const onExcluirTurma = (turma) => {
    setTurmaParaExcluir(turma);
    setAcaoPendente("inativar");
    setConfirmOpen(true);
  };

  const [acaoPendente, setAcaoPendente] = useState("inativar");

  const confirmarExclusao = async () => {
    if (!turmaParaExcluir) return;
    try {
      if (acaoPendente === "encerrar") {
        await turmaService.encerrarTurma(turmaParaExcluir.id);
        await carregarTurmas();
        toast.success(
          "Turma encerrada. Agora defina a situação de cada formando.",
        );
        setTurmaFormandos(turmaParaExcluir);
      } else {
        await excluirTurma(turmaParaExcluir.id);
        toast.success(`Turma "${turmaParaExcluir.nome}" inativada.`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Erro ao excluir turma.");
    } finally {
      setConfirmOpen(false);
      setTurmaParaExcluir(null);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans antialiased">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          titulo="Gestão Acadêmica"
          icone={BookOpen}
          usuario={{ nome: "Henrique", cargo: "Secretário" }}
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="mx-auto flex max-w-375 flex-col gap-6 p-4 sm:p-8">
            {/* Barra Superior de Navegação por Abas de Rota */}
            <div className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <ModulosControle moduloAtivo="Turmas" />
              <div className="flex items-center gap-4">
                <div className="hidden border-l border-slate-200 pl-4 text-right sm:block">
                  <p className="text-2xl font-black text-slate-900">
                    {loading ? "—" : turmasUi.length}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    turmas
                  </p>
                </div>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setMostrarSeletorTurma(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-900 transition hover:bg-emerald-100 disabled:cursor-wait disabled:opacity-50 sm:w-auto"
                >
                  <Plus size={16} /> Matricular aluno
                </button>
                <button
                  disabled={salvando}
                  onClick={onNovaTurma}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E7A3C] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm shadow-emerald-900/15 transition hover:bg-[#165a2d] active:scale-[0.98] disabled:opacity-60 sm:w-auto"
                >
                  <Plus size={16} /> Nova Turma
                </button>
              </div>
            </div>

            {/* Grid de Conteúdo das Turmas */}
            <div className="flex flex-col gap-5 animate-in fade-in duration-300">
              <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-100/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">
                    Turmas Ativas e Concluídas
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Busque e filtre as turmas cadastradas.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <label className="relative block">
                    <Search
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      value={busca}
                      onChange={(event) => setBusca(event.target.value)}
                      placeholder="Buscar turma..."
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-56"
                    />
                  </label>
                  <label className="relative flex items-center">
                    <SlidersHorizontal
                      size={14}
                      className="pointer-events-none absolute left-3 text-slate-400"
                    />
                    <select
                      value={filtroStatus}
                      onChange={(event) => setFiltroStatus(event.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 sm:w-40"
                    >
                      <option>Todas</option>
                      <option>Não Iniciada</option>
                      <option>Em Andamento</option>
                      <option>Concluída</option>
                      <option>Inativa</option>
                    </select>
                  </label>
                </div>
              </div>

              {!loading && error && (
                <div
                  role="alert"
                  className="flex flex-col gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span>{error}</span>
                  <button
                    type="button"
                    onClick={carregarTurmas}
                    className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-800 hover:bg-red-100 sm:self-auto"
                  >
                    <RefreshCw size={14} /> Tentar novamente
                  </button>
                </div>
              )}

              {!loading && !error && turmasFiltradas.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                  <p className="font-semibold text-slate-700">
                    Nenhuma turma encontrada
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Ajuste a busca ou o filtro de status.
                  </p>
                </div>
              )}
              {loading ? (
                <section
                  aria-busy="true"
                  aria-live="polite"
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <LoaderCircle size={18} className="animate-spin" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Carregando suas turmas
                      </p>
                      <p className="text-xs text-slate-500">
                        Estamos atualizando a lista acadêmica.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {[0, 1, 2].map((item) => (
                      <CartaoCarregando key={item} indice={item} />
                    ))}
                  </div>
                </section>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {turmasFiltradas.map((turma) => (
                    <CardTurma
                      key={turma.id}
                      turma={turma}
                      onEditar={onEditarTurma}
                      onExcluir={onExcluirTurma}
                      onDetalhes={setTurmaDetalhes}
                      onAlunos={onVer}
                      onMatricular={setTurmaParaMatricula}
                      onStatus={executarAcaoStatus}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        <ModalTurma
          isOpen={isModalAberto}
          onClose={() => setIsModalAberto(false)}
          onSalvar={onSalvarTurma}
          carregando={salvando}
          valoresPadrao={turmaEmEdicao}
        />

        <ModalAlunosPorTurma
          isOpen={isModalAbertoAlunosTurma}
          onClose={() => setIsModalAbertoAlunosTurma(false)}
          carregando={carregandoAlunos}
          erro={erroAlunos}
          dadosAlunos={dadosAlunosPorTurma}
          pagina={paginaAlunos}
          onMudarPagina={mudarPaginaAlunos}
          idTurma={idTurmaAlunos}
          onAtualizar={() => buscarAlunos(idTurmaAlunos, paginaAlunos)}
        />

        <ModalDetalhesTurma
          turma={turmaDetalhes}
          onClose={() => setTurmaDetalhes(null)}
          onVerAlunos={() => abrirAlunos(turmaDetalhes)}
        />
        {turmaParaMatricula && (
          <ModalMatriculas
            turma={turmaParaMatricula}
            onClose={() => setTurmaParaMatricula(null)}
            onConcluido={() => buscarAlunos(turmaParaMatricula.id, 0)}
          />
        )}
        {mostrarSeletorTurma && (
          <div
            className="fixed inset-0 z-[58] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
            onMouseDown={(event) =>
              event.target === event.currentTarget &&
              setMostrarSeletorTurma(false)
            }
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="escolher-turma-title"
              className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
            >
              <h2
                id="escolher-turma-title"
                className="text-lg font-black text-slate-900"
              >
                Onde deseja matricular?
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Selecione uma turma para continuar.
              </p>
              <div className="mt-4 space-y-2">
                {turmasUi
                  .filter(
                    (turma) => !["Concluída", "Inativa"].includes(turma.status),
                  )
                  .map((turma) => (
                    <button
                      key={turma.id}
                      type="button"
                      onClick={() => {
                        setMostrarSeletorTurma(false);
                        setTurmaParaMatricula(turma);
                      }}
                      className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left hover:border-emerald-300 hover:bg-emerald-50"
                    >
                      <span>
                        <span className="block text-sm font-bold text-slate-800">
                          {turma.nome}
                        </span>
                        <span className="mt-1 block text-xs text-slate-500">
                          {turma.status}
                        </span>
                      </span>
                      <span className="text-xs font-bold text-emerald-800">
                        Selecionar →
                      </span>
                    </button>
                  ))}
                {turmasUi.every((turma) =>
                  ["Concluída", "Inativa"].includes(turma.status),
                ) && (
                  <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                    Não há turmas disponíveis para novas matrículas.
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setMostrarSeletorTurma(false)}
                className="mt-4 w-full rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-600"
              >
                Cancelar
              </button>
            </section>
          </div>
        )}
        {turmaFormandos && (
          <ModalFormandos
            turma={turmaFormandos}
            onClose={() => setTurmaFormandos(null)}
          />
        )}

        <ConfirmDialog
          aberto={confirmOpen}
          titulo={
            acaoPendente === "encerrar" ? "Finalizar turma" : "Inativar turma"
          }
          mensagem={
            acaoPendente === "encerrar"
              ? `Deseja encerrar "${turmaParaExcluir?.nome}"? As avaliações dos alunos serão criadas e você poderá aprovar ou reprovar cada formando na próxima etapa.`
              : `Deseja inativar a turma "${turmaParaExcluir?.nome}"? O histórico será preservado.`
          }
          onConfirm={confirmarExclusao}
          onCancel={() => setConfirmOpen(false)}
          carregando={false}
          variant="danger"
          confirmText={
            acaoPendente === "encerrar"
              ? "Finalizar e avaliar alunos"
              : "Inativar turma"
          }
        />
      </div>
    </div>
  );
}
