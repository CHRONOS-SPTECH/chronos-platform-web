import api from "./api";

const aulaService = {
  listarAulasDoDia: async (instrutorId, data) => {
    const response = await api.get(
      `/aulas/dia?data=${data}&instrutorId=${instrutorId}`,
    );
    return response.data;
  },

  listarAulasDetalhadas: async () => {
    const response = await api.get("/aulas/detalhadas");
    return response.data;
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
};

export default aulaService;
