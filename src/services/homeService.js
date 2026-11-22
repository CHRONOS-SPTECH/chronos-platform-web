import api from "./api";

const homeEndpoints = {
  diretor: "/home/diretor",
  secretaria: "/home/secretaria",
  instrutor: "/home/instrutor",
};

const homeService = {
  getHome: async (role) => {
    const endpoint = homeEndpoints[role];
    if (!endpoint) {
      throw new Error(`Perfil de home inválido: ${role}`);
    }

    const response = await api.get(endpoint);
    return response.data;
  },
};

export default homeService;
