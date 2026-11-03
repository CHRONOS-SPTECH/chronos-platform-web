import api from "./api";

const blobParaDataUrl = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(blob);
});

const pessoaService = {
  listarPessoas: async ({ page = 0, size = 100, sort = "nome,asc" } = {}) => {
    const response = await api.get("/pessoas", { params: { page, size, sort } });
    return Array.isArray(response.data?.content) ? response.data.content : response.data;
  },

  listarPessoasDetalhadas: async ({ page = 0, size = 20, sort = "nome,asc" } = {}) => {
    const response = await api.get("/pessoas/details", { params: { page, size, sort } });
    return response.data;
  },

  listarTiposVinculo: async () => {
    const response = await api.get("/tipos-vinculo");
    return response.data;
  },

  buscarPessoaDetalhada: async (idPessoa) => {
    const response = await api.get(`/pessoas/details/${idPessoa}`);
    return response.data;
  },

  inativarPessoa: async (idPessoa) => api.patch(`/pessoas/${idPessoa}/inativacao`),

  atualizarBiometria: async (idPessoa, captura) => {
    const imagemPerfilBase64 = captura?.imagemBlob instanceof Blob
      ? await blobParaDataUrl(captura.imagemBlob)
      : undefined;
    const response = await api.put(`/pessoas/${idPessoa}/biometria`, {
      vetorBiometrico: captura.vetorBiometrico,
      ...(imagemPerfilBase64 ? { imagemPerfilBase64 } : {}),
    });
    return response.data;
  },
};

export default pessoaService;
