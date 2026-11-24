const PROFILE_KEY = "perfilSelecionado";

const setSession = (data) => {
  if (!data) return;
  const token = data.access_token || data.accessToken || data.token;
  const tokenType =
    data.token_type || data.tokenType || data.tipo_token || "Bearer";

  if (token) sessionStorage.setItem("token", token);
  sessionStorage.setItem("token_type", tokenType);

  const refreshToken =
    data.refresh_token || data.refreshToken || data.refresh_token;
  if (refreshToken) {
    sessionStorage.setItem("refresh_token", refreshToken);
  }

  const usuarioAtual = getSession();
  const sessaoAtualizada = {
    ...(usuarioAtual || {}),
    ...data,
  };

  if (data.usuario == null && usuarioAtual?.usuario != null) {
    sessaoAtualizada.usuario = usuarioAtual.usuario;
  }
  if (!Array.isArray(data.perfis) && Array.isArray(usuarioAtual?.perfis)) {
    sessaoAtualizada.perfis = usuarioAtual.perfis;
  }

  sessionStorage.setItem("usuario", JSON.stringify(sessaoAtualizada));
};

const clearSession = () => {
  sessionStorage.clear();
};

const getSession = () => {
  const u = sessionStorage.getItem("usuario");
  if (!u) return null;

  try {
    return JSON.parse(u);
  } catch (error) {
    console.error("Erro ao ler sessão salva:", error);
    return null;
  }
};

const getToken = () => sessionStorage.getItem("token");

const getRefreshToken = () => sessionStorage.getItem("refresh_token");

const getUser = () => getSession();

const setSelectedProfile = (tipo) => {
  if (!tipo) return sessionStorage.removeItem(PROFILE_KEY);
  sessionStorage.setItem(PROFILE_KEY, String(tipo));
};

const getSelectedProfile = () => sessionStorage.getItem(PROFILE_KEY);

const sessionService = {
  setSession,
  clearSession,
  getSession,
  getToken,
  getRefreshToken,
  getUser,
  setSelectedProfile,
  getSelectedProfile,
};

export default sessionService;
