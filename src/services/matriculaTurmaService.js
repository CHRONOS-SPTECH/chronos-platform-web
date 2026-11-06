import api from "./api";

const matriculaTurmaService = {
  listarMatriculas: async () => (await api.get("/matriculas-turma")).data,
  buscarMatricula: async (idTurma, idPessoa) => {
    const response = await api.get(
      `/matriculas-turma/${idTurma}/pessoas/${idPessoa}`,
    );
    return response.data;
  },

  matricularPessoa: async ({ idTurma, idPessoa, dataMatricula }) =>
    (
      await api.post("/matriculas-turma", {
        id_turma: Number(idTurma),
        id_pessoa: Number(idPessoa),
        data_matricula: dataMatricula,
      })
    ).data,
  matricularLote: async ({ idTurma, idsPessoas, dataMatricula }) =>
    (
      await api.post("/matriculas-turma/lote", {
        id_turma: Number(idTurma),
        ids_pessoas: idsPessoas.map(Number),
        data_matricula: dataMatricula || undefined,
      })
    ).data,
  atualizarMatricula: async (idTurma, idPessoa, dataMatricula) =>
    (
      await api.put(`/matriculas-turma/${idTurma}/pessoas/${idPessoa}`, {
        id_turma: Number(idTurma),
        id_pessoa: Number(idPessoa),
        data_matricula: dataMatricula,
      })
    ).data,
  removerMatricula: async (idTurma, idPessoa) =>
    api.delete(`/matriculas-turma/${idTurma}/pessoas/${idPessoa}`),
};

export default matriculaTurmaService;
