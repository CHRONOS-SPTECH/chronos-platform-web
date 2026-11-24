import api from "./api";

const usuarioPerfilService = {
  listarVinculos: async () => {
    const response = await api.get("/usuarios-perfis");
    return response.data;
  },
  buscarVinculo: async (id) => {
    const response = await api.get(`/usuarios-perfis/${id}`);
    return response.data;
  },
  criarVinculo: async (idUsuario, idPerfil) => {
    const response = await api.post("/usuarios-perfis", {
      id_usuario: idUsuario,
      id_perfil: idPerfil,
    });
    return response.data;
  },
  atualizarVinculo: async (id, payload) => {
    const response = await api.put(`/usuarios-perfis/${id}`, payload);
    return response.data;
  },
  removerVinculo: async (id) => {
    const response = await api.delete(`/usuarios-perfis/${id}`);
    return response.data;
  },
};

export default usuarioPerfilService;
