import api from "./api";

const usuarioService = {
  listarUsuarios: async () => {
    const response = await api.get("/usuarios");
    return response.data;
  },
};

export default usuarioService;
