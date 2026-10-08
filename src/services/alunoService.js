// alunoService.js
import api from "./api";

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

  cadastrarAlunoComBiometria: async (dadosAluno, biometria) => {
    if (!(biometria.imagemBlob instanceof Blob)) {
      throw new Error("A imagem biométrica deve ser enviada como Blob.");
    }

    // 1. Converte a foto Blob em string Base64 mantendo a qualidade máxima
    const imagemBase64 = await blobParaBase64(biometria.imagemBlob);

    // 2. Monta o payload unificado em JSON puro (sem FormData)
    const payload = {
      ...dadosAluno,
      imagemPerfilBase64: imagemBase64,
      vetorBiometrico: biometria.vetorBiometrico,
    };

    let tamanhoTotalJson = JSON.stringify(payload).length;
    console.log(
      `[Biometria JSON] Tamanho total real do payload: ${(tamanhoTotalJson / 1024 / 1024).toFixed(4)} MB`,
    );

    // 3. Envia para o endpoint mapeado no Controller como JSON puro
    const response = await api.post("/pessoas/registro", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

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
