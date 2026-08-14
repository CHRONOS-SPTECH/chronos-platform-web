import { formatarDataBr } from "./DateUtils";
import turmaService from "../services/turmaService";

export const getApiField = (obj, snake, camel) => obj?.[snake] ?? obj?.[camel];

export const getTurmaId = (turma) =>
  getApiField(turma, "id_turma", "idTurma") ?? turma?.id;

export const extrairMensagemErro = (error, padrao) => {
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

export const calcularProgresso = (dataInicio, dataFim, statusLabel) => {
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

export const mapApiTurmaToUi = (turma) => {
  const statusApi = getApiField(turma, "status_turma", "statusTurma");
  const statusLabel = turmaService.normalizarStatusParaLabel(statusApi);
  const dataInicioApi = getApiField(turma, "data_inicio", "dataInicio");
  const dataFimApi = getApiField(
    turma,
    "data_encerramento",
    "dataEncerramento",
  );

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
