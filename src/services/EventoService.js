import api from "./api";

const unwrap = (response) => response.data?.data ?? response.data;

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

  getCategorias: async () => unwrap(await api.get("/categorias-atividade")),

  getSecretarias: async () => unwrap(await api.get("/secretarias")),
};

export default eventoService;
