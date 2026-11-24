import api from "./api";

const perfilService = {
  listarPerfis: async () => {
    const response = await api.get("/perfis-acesso");
    return response.data;
  },
  buscarPerfil: async (id) => {
    const response = await api.get(`/perfis-acesso/${id}`);
    return response.data;
  },
  criarPerfil: async (payload) => {
    const response = await api.post("/perfis-acesso", payload);
    return response.data;
  },
  atualizarPerfil: async (id, payload) => {
    const response = await api.put(`/perfis-acesso/${id}`, payload);
    return response.data;
  },
  removerPerfil: async (id) => {
    const response = await api.delete(`/perfis-acesso/${id}`);
    return response.data;
  },
};

export default perfilService;
