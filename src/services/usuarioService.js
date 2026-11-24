import api from "./api";

const usuarioService = {
  listarUsuarios: async () => {
    const response = await api.get("/usuarios");
    return response.data;
  },
  buscarUsuario: async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },
  criarUsuario: async (payload) => {
    const response = await api.post("/usuarios", payload);
    return response.data;
  },
  atualizarUsuario: async (id, payload) => {
    const response = await api.put(`/usuarios/${id}`, payload);
    return response.data;
  },
  removerUsuario: async (id) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },
};

export default usuarioService;
