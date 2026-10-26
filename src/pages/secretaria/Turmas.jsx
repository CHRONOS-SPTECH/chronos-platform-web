import { useState } from "react";
import { BookOpen, Plus, Search, SlidersHorizontal } from "lucide-react";
import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/homeSecretario/Header";
import ModulosControle from "../../components/turmas/ModuloControle";
import CardTurma from "../../components/turmas/CardTurma";
import ModalTurma from "../../components/turmas/ModalTurma";
import useTurmas from "../../hooks/useTurmas";
import { useToast } from "../../components/alert-toast/ToastProvider";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import ModalAlunosPorTurma from "../../components/turmas/ModalTurmaAlunos";

export default function Turmas() {
  const toast = useToast();
  const [isModalAberto, setIsModalAberto] = useState(false);
  const [isModalAbertoAlunosTurma, setIsModalAbertoAlunosTurma] = useState(false);
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
  } = useTurmas();

  const turmasFiltradas = turmasUi.filter((turma) => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    const correspondeBusca = !termo || String(turma.nome || "").toLocaleLowerCase("pt-BR").includes(termo);
    const correspondeStatus = filtroStatus === "Todas" || turma.status === filtroStatus;
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
      setErroAlunos(err?.response?.data?.message || "Não foi possível carregar os alunos desta turma.");
    } finally {
      setCarregandoAlunos(false);
    }
  };

  const mudarPaginaAlunos = async (pagina) => {
    if (pagina < 0 || !idTurmaAlunos || pagina >= (dadosAlunosPorTurma?.total_paginas ?? Infinity)) return;
    setPaginaAlunos(pagina);
    setCarregandoAlunos(true);
    setErroAlunos("");
    try {
      await buscarAlunos(idTurmaAlunos, pagina);
    } catch (err) {
      setErroAlunos(err?.response?.data?.message || "Não foi possível carregar os alunos desta turma.");
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

  const onExcluirTurma = (turma) => {
    setTurmaParaExcluir(turma);
    setConfirmOpen(true);
  };

  const confirmarExclusao = async () => {
    if (!turmaParaExcluir) return;
    try {
      await excluirTurma(turmaParaExcluir.id);
      toast.success(`Turma "${turmaParaExcluir.nome}" excluída.`);
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
                    <p className="text-2xl font-black text-slate-900">{turmasUi.length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">turmas</p>
                  </div>
                  <button onClick={onNovaTurma} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E7A3C] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm shadow-emerald-900/15 transition hover:bg-[#165a2d] active:scale-[0.98] sm:w-auto">
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
                  <p className="mt-1 text-xs text-slate-500">Busque e filtre as turmas cadastradas.</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <label className="relative block">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Buscar turma..." className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-56" />
                  </label>
                  <label className="relative flex items-center">
                    <SlidersHorizontal size={14} className="pointer-events-none absolute left-3 text-slate-400" />
                    <select value={filtroStatus} onChange={(event) => setFiltroStatus(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 sm:w-40">
                      <option>Todas</option><option>Não Iniciada</option><option>Em Andamento</option><option>Concluída</option>
                    </select>
                  </label>
                </div>
              </div>

              {loading && (
                <p className="text-sm text-slate-500">Carregando turmas...</p>
              )}

              {!loading && error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {!loading && !error && turmasFiltradas.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center"><p className="font-semibold text-slate-700">Nenhuma turma encontrada</p><p className="mt-1 text-sm text-slate-500">Ajuste a busca ou o filtro de status.</p></div>}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {turmasFiltradas.map((turma) => (
                  <CardTurma
                    key={turma.id}
                    turma={turma}
                    onEditar={onEditarTurma}
                    onExcluir={onExcluirTurma}
                    onVer={onVer}
                  />
                ))}
              </div>
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
        />

        <ConfirmDialog
          aberto={confirmOpen}
          titulo="Confirmar Exclusão"
          mensagem={`Deseja excluir a turma "${turmaParaExcluir?.nome}"?`}
          onConfirm={confirmarExclusao}
          onCancel={() => setConfirmOpen(false)}
          carregando={false}
          variant="danger"
          confirmText="Excluir turma"
        />


      </div>
    </div>
  );
}
