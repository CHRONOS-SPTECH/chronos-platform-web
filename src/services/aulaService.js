import api from "./api";
import { PAGE_SIZE } from "../config/pagination";

const aulaService = {
  listarAulasDoDia: async (instrutorId, data, { page = 0, size = PAGE_SIZE, sort = "idAula,asc" } = {}) => {
    const response = await api.get("/aulas/dia", {
      params: { data, instrutorId, page, size, ...(sort ? { sort } : {}) },
    });
    return response.data;
  },

  listarTodasAulasDoDia: async (instrutorId, data, { size = PAGE_SIZE, sort = "idAula,asc" } = {}) => {
    const registros = [];
    let page = 0;
    let last = false;
    while (!last) {
      const resultado = await aulaService.listarAulasDoDia(instrutorId, data, { page, size, sort });
      const conteudo = Array.isArray(resultado?.content) ? resultado.content : Array.isArray(resultado) ? resultado : [];
      registros.push(...conteudo);
      if (!resultado?.content || resultado.last === true || conteudo.length === 0) last = true;
      else page = (resultado.number ?? page) + 1;
    }
    return registros;
  },

  listarAulas: async ({ page = 0, size = PAGE_SIZE, sort = "idAula,asc" } = {}) => {
    const response = await api.get("/aulas", { params: { page, size, ...(sort ? { sort } : {}) } });
    return response.data;
  },

  listarAulasDetalhadas: async ({ page = 0, size = PAGE_SIZE, sort = "idAula,asc" } = {}) => {
    const response = await api.get("/aulas/detalhadas", {
      params: { page, size, ...(sort ? { sort } : {}) },
    });
    return response.data;
  },

  listarAulasDaTurma: async (idTurma, { page = 0, size = PAGE_SIZE, sort = "idAula,asc" } = {}) => {
    const response = await api.get(`/aulas/turma/${idTurma}`, {
      params: { page, size, ...(sort ? { sort } : {}) },
    });
    return response.data;
  },

  listarTodasAulasDetalhadas: async ({ size = PAGE_SIZE, sort } = {}) => {
    const registros = [];
    let page = 0;
    let ultima = false;
    while (!ultima) {
      const resultado = await aulaService.listarAulasDetalhadas({ page, size, sort });
      const conteudo = Array.isArray(resultado?.content) ? resultado.content : Array.isArray(resultado) ? resultado : [];
      registros.push(...conteudo);
      if (!resultado?.content || resultado.last === true || conteudo.length === 0) ultima = true;
      else page = (resultado.number ?? page) + 1;
    }
    return registros;
  },

  buscarDetalhesAula: async (idAula) => {
    const response = await api.get(`/aulas/${idAula}/detalhada`);
    return response.data;
  },

  buscarChamadaPorAula: async (idAula) => {
    const response = await api.get(`/chamadas-aula/aula/${idAula}`);
    return response.data;
  },

  salvarChamadaEmLote: async (dadosChamada) => {
    const response = await api.post("/chamadas-aula/em-lote", dadosChamada);
    return response.data;
  },
  remanejar: async (mudancas) => {
    const response = await api.patch("/aulas/remanejar", mudancas);
    return response.data;
  },
  atualizarAula: async (id, dados) => {
    const response = await api.patch(`/aulas/${id}`, dados);
    return response.data;
  },
  importar: async (formData) => {
    const response = await api.post("/aulas/importar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  excluirAula: async (id) => {
    const response = await api.delete(`/aulas/${id}`);
    return response.data;
  },
  criarAula: async (dados) => {
    const response = await api.post("/aulas", dados);
    return response.data;
  },
};

export default aulaService;
