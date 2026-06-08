import axios from "axios";
import sessionService from "./sessionService";

const api = axios.create({
  baseURL: "/api",
});

let redirecionandoParaLogin = false;

const extrairMensagemErro = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.erro ||
    error?.response?.data?.error ||
    error?.message ||
    ""
  );
};

const ehTokenExpirado = (error) => {
  const status = error?.response?.status;
  const mensagem = String(extrairMensagemErro(error)).toLowerCase();
  const endpoint = error?.config?.url || "";

  if (endpoint.includes("/auth/login")) return false;

  const tokenErrors = [
    "expiredjwtexception",
    "jwt expired",
    "token expirado",
    "token inválido",
    "token invalido",
    "invalid token",
    "bearer",
  ];

  const mensagemDeToken = tokenErrors.some((texto) => mensagem.includes(texto));

  return mensagemDeToken && (status === 401 || status === 403);
};

api.interceptors.request.use((config) => {
  const token = sessionService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (ehTokenExpirado(error) && !redirecionandoParaLogin) {
      redirecionandoParaLogin = true;
      sessionService.clearSession();

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
