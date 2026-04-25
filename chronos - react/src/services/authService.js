import api from "./api";

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
};

export default authService;
