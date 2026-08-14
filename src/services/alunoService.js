import api from "./api";

const alunoService = {
  listarAlunos: async () => {
    const response = await api.get("/pessoas/details");
    return response.data;
  },

  listarAlunosPorTurma: async (idTurma) => {
    const response = await api.get(`/turmas/${idTurma}/alunos`);
    return response.data;
  },

  cadastrarAluno: async (dadosAluno) => {
    const response = await api.post("/pessoas", dadosAluno);
    return response.data;
  },

  atualizarAluno: async (idAluno, dadosAluno) => {
    const response = await api.put(`/pessoas/${idAluno}`, dadosAluno);
    return response.data;
  },

  excluirAluno: async (idAluno) => {
    await api.delete(`/pessoas/${idAluno}`);
  },

  cadastrarEndereco: async (dadosEndereco) => {
    const response = await api.post("/enderecos-pessoa", dadosEndereco);
    return response.data;
  },

  atualizarEndereco: async (idEndereco, dadosEndereco) => {
    const response = await api.put(
      `/enderecos-pessoa/${idEndereco}`,
      dadosEndereco,
    );
    return response.data;
  },
};

export default alunoService;
