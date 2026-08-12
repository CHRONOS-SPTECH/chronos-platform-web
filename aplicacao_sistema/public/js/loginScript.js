import { isValidEmail } from "./utils/validationForm.js";
import { error } from "./utils/toast.js";
import { findUserByEmail } from "./services/authService.js";

document.addEventListener("DOMContentLoaded", () => {
  const btnEntrar = document.querySelector(".btn-entrar");
  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");
  const alertInput = document.querySelector(".alert-input");
  alertInput.classList.remove("active");

  btnEntrar.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();
    alertInput.classList.remove("active");

    if (!email || !senha) {
      error("Por favor, preencha email e senha.");
      return;
    }

    if (!isValidEmail(email)) {
      alertInput.classList.add("active");
      return;
    }

    try {
      const users = await findUserByEmail(email);

      const user = users.find((u) => u.senha === senha);

      if (user) {
        user.tipo = user.tipo.toLowerCase(); // 'aluno' ou 'voluntário'
        localStorage.setItem("chronos_user", JSON.stringify(user));
        window.location.href = "telaAlunos.html";
      } else {
        error("Email ou senha incorretos.");
      }
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      error("Erro ao conectar ao servidor.");
    }
  });
});
