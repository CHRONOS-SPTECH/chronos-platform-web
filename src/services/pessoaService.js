import api from "./api";

const pessoaService = {
  listarPessoas: async () => {
    const response = await api.get("/pessoas");
    return response.data;
  },
};

export default pessoaService;
