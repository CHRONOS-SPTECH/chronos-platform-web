import api from "./api";
import sessionService from "./sessionService";

const authService = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", {
      email_login: email,
      senha: password,
    });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  setSession: (data) => {
    sessionService.setSession(data);
  },

  clearSession: () => {
    sessionService.clearSession();
  },

  getToken: () => {
    return sessionService.getToken();
  },

  getUser: () => {
    return sessionService.getUser();
  },
};

export default authService;
