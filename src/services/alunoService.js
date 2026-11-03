// alunoService.js
import api from "./api";
import { PAGE_SIZE } from "../config/pagination";

// Função auxiliar para converter Blob em Base64 nativamente no navegador
const blobParaBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onloadend = () => resolve(leitor.result); // Retorna a string "data:image/jpeg;base64,..."
    leitor.onerror = reject;
    leitor.readAsDataURL(blob);
  });
};

const alunoService = {
  listarAlunos: async ({ page = 0, size = PAGE_SIZE, sort = "nome,asc" } = {}) => {
    const response = await api.get("/alunos", {
      params: { page, size, sort },
    });
    return response.data;
  },

  listarPessoasExternas: async ({ page = 0, size = PAGE_SIZE, sort = "nome,asc" } = {}) => {
    const response = await api.get("/pessoas", { params: { page, size, sort } });
    return response.data;
  },

  listarAlunosPorTurma: async (idTurma, { page = 0, size = PAGE_SIZE, sort = "pessoa.nome,asc" } = {}) => {
    const response = await api.get(`/turmas/${idTurma}/alunos`, {
      params: { page, size, sort },
    });
    return response.data;
  },

  registrarPessoa: async (dadosPessoa, biometria = null) => {
    const payload = {
      ...dadosPessoa,
    };
    if (biometria?.imagemBlob instanceof Blob) {
      payload.imagemPerfilBase64 = await blobParaBase64(biometria.imagemBlob);
    }
    if (biometria?.vetorBiometrico?.length) {
      payload.vetorBiometrico = biometria.vetorBiometrico;
    }
    const response = await api.post("/pessoas/registro", payload);

    return response.data;
  },

  atualizarAluno: async (idAluno, dadosAluno) => {
    const response = await api.put(`/pessoas/${idAluno}`, dadosAluno);
    return response.data;
  },

};

export default alunoService;
