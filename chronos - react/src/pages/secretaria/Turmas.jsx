import { useState } from "react";
import { BookOpen, Plus } from "lucide-react";
import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/homeSecretario/Header";
import ModulosControle from "../../components/turmas/ModuloControle";
import CardTurma from "../../components/turmas/CardTurma";
import ModalTurma from "../../components/turmas/ModalTurma";
import useTurmas from "../../hooks/useTurmas";
import { useToast } from "../../components/alert-toast/ToastProvider";
import ConfirmDialog from "../../components/common/ConfirmDialog";

export default function Turmas() {
  const toast = useToast();
  const [isModalAberto, setIsModalAberto] = useState(false);
  const [turmaEmEdicao, setTurmaEmEdicao] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [turmaParaExcluir, setTurmaParaExcluir] = useState(null);

  const {
    turmasUi,
    loading,
    error,
    salvando,
    carregarTurmas,
    salvarTurma,
    excluirTurma,
  } = useTurmas();

  const onNovaTurma = () => {
    setTurmaEmEdicao(null);
    setIsModalAberto(true);
  };

  const onEditarTurma = (turma) => {
    setTurmaEmEdicao(turma.raw);
    setIsModalAberto(true);
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
          <div className="max-w-375 mx-auto p-8 flex flex-col gap-6">
            {/* Barra Superior de Navegação por Abas de Rota */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-6">
              <ModulosControle moduloAtivo="Turmas" />

              <button
                onClick={onNovaTurma}
                className="flex items-center gap-2 bg-[#1E7A3C] hover:bg-[#165a2d] text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-2xl transition-all shadow-md shadow-green-100/50 active:scale-[0.98]"
              >
                <Plus size={16} />
                Nova Turma
              </button>
            </div>

            {/* Grid de Conteúdo das Turmas */}
            <div className="flex flex-col gap-5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                  Turmas Ativas e Concluídas
                </h2>
                <span className="text-xs font-bold text-slate-400">
                  {turmasUi.length} turmas listadas
                </span>
              </div>

              {loading && (
                <p className="text-sm text-slate-500">Carregando turmas...</p>
              )}

              {!loading && error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {turmasUi.map((turma) => (
                  <CardTurma
                    key={turma.id}
                    turma={turma}
                    onEditar={onEditarTurma}
                    onExcluir={onExcluirTurma}
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

        <ConfirmDialog
          aberto={confirmOpen}
          titulo="Confirmar Exclusão"
          mensagem={`Deseja excluir a turma "${turmaParaExcluir?.nome}"?`}
          onConfirm={confirmarExclusao}
          onCancel={() => setConfirmOpen(false)}
          carregando={false}
        />
      </div>
    </div>
  );
}
