import axios from "axios";
import sessionService from "./sessionService";
import { API_BASE_URL } from "../config/app";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
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
  async (error) => {
    const status = error?.response?.status;
    const endpoint = error?.config?.url || "";
    const refreshToken = sessionService.getRefreshToken();

    if (
      status === 401 &&
      refreshToken &&
      !endpoint.includes("/auth/refresh") &&
      !error.config?._retry
    ) {
      error.config._retry = true;
      try {
        const refreshResponse = await api.post("/auth/refresh", {
          refreshToken,
        });
        sessionService.setSession(refreshResponse.data);
        const token = sessionService.getToken();
        if (token) error.config.headers.Authorization = `Bearer ${token}`;
        return api(error.config);
      } catch {
        sessionService.clearSession();
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login"
        ) {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    }

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
