import api from "./api";

const matriculaTurmaService = {
  buscarMatricula: async (idTurma, idPessoa) => {
    const response = await api.get(`/matriculas-turma/${idTurma}/pessoas/${idPessoa}`);
    return response.data;
  },

  matricularPessoa: async ({ idTurma, idPessoa, dataMatricula }) =>
    api.post("/matriculas-turma", {
      id_turma: Number(idTurma),
      id_pessoa: Number(idPessoa),
      data_matricula: dataMatricula,
    }),
};

export default matriculaTurmaService;
