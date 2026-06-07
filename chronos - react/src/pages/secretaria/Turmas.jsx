import { useEffect, useMemo, useState } from "react";
import { BookOpen, Plus } from "lucide-react";
import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/homeSecretario/Header";
import ModulosControle from "../../components/turmas/ModuloControle";
import CardTurma from "../../components/turmas/CardTurma";
import ModalTurma from "../../components/turmas/ModalTurma";
import { formatarDataBr } from "../../utils/DateUtils";
import turmaService from "../../services/turmaService";

const getApiField = (obj, snake, camel) => obj?.[snake] ?? obj?.[camel];
const getTurmaId = (turma) =>
  getApiField(turma, "id_turma", "idTurma") ?? turma?.id;

const extrairMensagemErro = (error, padrao) => {
  const status = error?.response?.status;
  if (status === 403) {
    const detalhe =
      error?.response?.data?.message ||
      error?.response?.data?.erro ||
      error?.response?.data?.error;

    return detalhe
      ? `${padrao} Acesso negado (403). Seu usuário está autenticado, mas não tem permissão para esta ação. ${detalhe}`
      : `${padrao} Acesso negado (403). Seu usuário está autenticado, mas não tem permissão para esta ação.`;
  }

  const mensagem =
    error?.response?.data?.message ||
    error?.response?.data?.erro ||
    error?.response?.data?.error ||
    error?.message;

  return mensagem ? `${padrao} ${mensagem}` : padrao;
};

const calcularProgresso = (dataInicio, dataFim, statusLabel) => {
  const status = (statusLabel || "").toLowerCase();
  if (status.includes("conclu") || status.includes("formad")) return 100;

  if (!dataInicio || !dataFim) return 0;
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  const hoje = new Date();

  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) return 0;
  if (hoje <= inicio) return 0;
  if (hoje >= fim) return 100;

  const total = fim.getTime() - inicio.getTime();
  const atual = hoje.getTime() - inicio.getTime();
  return Math.max(0, Math.min(100, Math.round((atual / total) * 100)));
};

const mapApiTurmaToUi = (turma) => {
  const statusApi = getApiField(turma, "status_turma", "statusTurma");
  const statusLabel = turmaService.normalizarStatusParaLabel(statusApi);
  const dataInicioApi = getApiField(turma, "data_inicio", "dataInicio");
  const dataFimApi = getApiField(turma, "data_encerramento", "dataEncerramento");

  return {
    id: getApiField(turma, "id_turma", "idTurma"),
    nome: getApiField(turma, "nome_turma", "nomeTurma"),
    status: statusLabel,
    dataInicio: formatarDataBr(dataInicioApi),
    dataFim: formatarDataBr(dataFimApi),
    progresso: calcularProgresso(dataInicioApi, dataFimApi, statusLabel),
    raw: turma,
  };
};

export default function Turmas() {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [isModalAberto, setIsModalAberto] = useState(false);
  const [turmaEmEdicao, setTurmaEmEdicao] = useState(null);
  const [salvandoTurma, setSalvandoTurma] = useState(false);

  const carregarTurmas = async () => {
    try {
      setLoading(true);
      setErro("");
      const dados = await turmaService.listarTurmas();
      setTurmas(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error("Erro ao carregar turmas:", error);
      console.error("Status:", error?.response?.status);
      console.error("Mensagem:", error?.response?.data);
      setErro(extrairMensagemErro(error, "Não foi possível carregar as turmas."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTurmas();
  }, []);

  const turmasUi = useMemo(() => turmas.map(mapApiTurmaToUi), [turmas]);

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
      setSalvandoTurma(true);
      setErro("");

      if (turmaEmEdicao?.id_turma || turmaEmEdicao?.id) {
        const turmaId = turmaEmEdicao?.id_turma || turmaEmEdicao?.id;
        const turmaAtualizada = await turmaService.atualizarTurma(
          turmaId,
          dadosTurma
        );
        const listaAtualizada = turmas.map((item) =>
          getTurmaId(item) === turmaId ? turmaAtualizada : item
        );
        setTurmas(listaAtualizada);
      } else {
        const turmaCriada = await turmaService.criarTurma(dadosTurma);
        setTurmas([...turmas, turmaCriada]);
      }

      setIsModalAberto(false);
      setTurmaEmEdicao(null);
    } catch (error) {
      console.error("Erro ao salvar turma:", error);
      setErro(extrairMensagemErro(error, "Erro ao salvar turma."));
    } finally {
      setSalvandoTurma(false);
    }
  };

  const onExcluirTurma = async (turma) => {
    const confirmou = window.confirm(
      `Deseja excluir a turma \"${turma.nome}\"?`,
    );
    if (!confirmou) return;

    try {
      await turmaService.excluirTurma(turma.id);
      const listaFiltrada = turmas.filter(
        (item) => getTurmaId(item) !== turma.id,
      );
      setTurmas(listaFiltrada);
      setErro("");
    } catch (error) {
      console.error("Erro ao excluir turma:", error);
      setErro(extrairMensagemErro(error, "Erro ao excluir turma."));
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans antialiased">
      <Sidebar tipoUsuario="secretario" />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          titulo="Gestão Acadêmica"
          icone={BookOpen}
          usuario={{ nome: "Henrique", cargo: "Secretário" }}
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1500px] mx-auto p-8 flex flex-col gap-6">
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

              {!loading && erro && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {erro}
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
          carregando={salvandoTurma}
          valoresPadrao={turmaEmEdicao}
        />
      </div>
    </div>
  );
}
