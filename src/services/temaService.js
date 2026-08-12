import api from "./api";

const temaService = {
  listarTemas: async () => {
    const response = await api.get("/temas-aula");
    return response.data;
  },
};

export default temaService;
