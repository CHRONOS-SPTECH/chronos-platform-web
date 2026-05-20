const setSession = (data) => {
  if (!data) return;
  if (data.token) sessionStorage.setItem("token", data.token);
  if (data.token_type) sessionStorage.setItem("token_type", data.token_type);
  if (data.usuario) {
    try {
      sessionStorage.setItem("usuario", JSON.stringify(data.usuario));
    } catch (e) {
      console.error("Erro ao salvar usuário na sessão:", e);
    }
  }
};

const clearSession = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("token_type");
  sessionStorage.removeItem("usuario");
};

const getToken = () => {
  return sessionStorage.getItem("token");
};

const getUser = () => {
  const u = sessionStorage.getItem("usuario");
  if (!u) return null;
  try {
    return JSON.parse(u);
  } catch (e) {
    return null;
  }
};

const sessionService = {
  setSession,
  clearSession,
  getToken,
  getUser,
};

export default sessionService;
