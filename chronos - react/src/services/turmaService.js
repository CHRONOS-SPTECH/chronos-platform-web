import api from "./api";

const STATUS_LABELS_VALIDOS = [
	"Não Iniciada",
	"Em Andamento",
	"Concluída",
];

const STATUS_LABEL_CANONICA = {
	naoiniciada: "Não Iniciada",
	emandamento: "Em Andamento",
	concluida: "Concluída",
};

const normalizarChaveStatus = (status) =>
	String(status || "")
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z]/g, "");

const normalizarDataParaApi = (data) => {
	if (!data) return null;
	const valor = String(data).trim();

	if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
		return valor;
	}

	const matchBr = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
	if (matchBr) {
		const [, dia, mes, ano] = matchBr;
		return `${ano}-${mes}-${dia}`;
	}

	return valor;
};

// padroniza para os labels aceitos pelo backend
const normalizarStatusParaLabel = (status) => {
	if (!status) return "Não Iniciada";
	if (STATUS_LABELS_VALIDOS.includes(status)) return status;

	const chave = normalizarChaveStatus(status);
	if (STATUS_LABEL_CANONICA[chave]) return STATUS_LABEL_CANONICA[chave];

	return "Não Iniciada";
};

const dataToApi = (turma) => ({
	nome_turma: turma.nome_turma ?? turma.nomeTurma ?? "",
	data_inicio: normalizarDataParaApi(turma.data_inicio ?? turma.dataInicio),
	data_encerramento: normalizarDataParaApi(
		turma.data_encerramento ?? turma.dataEncerramento,
	),
	status_turma: normalizarStatusParaLabel(turma.status_turma ?? turma.statusTurma),
});

// get
const turmaService = {
	listarTurmas: async () => {
		const response = await api.get("/turmas");
		return response.data;
	},

	buscarTurmaPorId: async (id) => {
		const response = await api.get(`/turmas/${id}`);
		return response.data;
	},

// post
	criarTurma: async (dados) => {
		const response = await api.post("/turmas", dataToApi(dados));
		return response.data;
	},

// put
	atualizarTurma: async (id, dados) => {
		const response = await api.put(`/turmas/${id}`, dataToApi(dados));
		return response.data;
	},

// delete 
	excluirTurma: async (id) => {
		await api.delete(`/turmas/${id}`);
	},

	normalizarStatusParaLabel,
};

export default turmaService;
