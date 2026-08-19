import api from "./api";

const unwrap = (response) => response.data?.data ?? response.data;

const getFromAvailableRoute = async (routes) => {
  let lastError;

  for (const route of routes) {
    try {
      return unwrap(await api.get(route));
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;
      if (status !== 404 && status !== 403) throw error;
    }
  }

  throw lastError;
};

const eventoService = {
  getEventos: async () => unwrap(await api.get("/eventos")),

  getEventoById: async (id) => unwrap(await api.get(`/eventos/${id}`)),

  createEvento: async (data) => unwrap(await api.post("/eventos", data)),

  updateEvento: async (id, data) =>
    unwrap(await api.put(`/eventos/${id}`, data)),

  deleteEvento: async (id) => {
    const response = await api.delete(`/eventos/${id}`);
    return unwrap(response);
  },

  getCategorias: async () =>
    getFromAvailableRoute([
      "/categorias",
      "/categorias-atividade",
      "/categoria-atividade",
      "/categoriaAtividade",
    ]),

  getSecretarias: async () =>
    getFromAvailableRoute(["/secretarias", "/secretaria"]),
};

export default eventoService;