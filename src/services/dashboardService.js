import api from "./api";

export const dashboardService = {
  getResumo: () => api.get("/dashboard/resumo").then((res) => res.data),
  getInstrutores: () =>
    api.get("/dashboard/instrutores").then((res) => res.data),
  getAlunosPorNivel: () =>
    api.get("/dashboard/alunos-por-nivel").then((res) => res.data),
  getGenero: () => api.get("/dashboard/genero").then((res) => res.data),
  getFaixaEtaria: () =>
    api.get("/dashboard/faixa-etaria").then((res) => res.data),
};
