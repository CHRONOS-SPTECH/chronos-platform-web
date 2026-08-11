const PROFILE_KEY = "perfilSelecionado";

const setSession = (data) => {
  if (!data) return;
  if (data.token) sessionStorage.setItem("token", data.token);
  if (data.token_type) sessionStorage.setItem("token_type", data.token_type);

  sessionStorage.setItem("usuario", JSON.stringify(data));
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
  getUser,
  setSelectedProfile,
  getSelectedProfile,
};

export default sessionService;
