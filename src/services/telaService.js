import api from "./api";

const telaService = {
  listarTelas: async () => {
    const response = await api.get("/telas");
    return response.data;
  },
};

export default telaService;
