import { useState } from "react";
import Input from "../Input";
import Button from "../Button";
import authService from "../../services/authService";

function LoginForm({ onForgotPassword, onStatusChange }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  async function login() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {
      email:
        email.trim() === ""
          ? "Campo obrigatório"
          : !emailRegex.test(email)
          ? "Formato de e-mail inválido"
          : "",
      password: password.trim() === "" ? "Campo obrigatório" : "",
    };
    setErrors(newErrors);
    if (newErrors.email || newErrors.password) return;

    onStatusChange({ type: "", message: "" });
    setLoading(true);

    try {
      const data = await authService.login(email, password);

      authService.setSession(data);

      onStatusChange({
        type: "success",
        message: "Acesso autorizado! Entrando...",
      });

      setTimeout(() => {
        window.location.href = "/perfis";
      }, 1000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "E-mail ou senha incorretos.";

      onStatusChange({
        type: "error",
        message: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
          E-mail Corporativo
        </label>
        <Input
          type="email"
          placeholder="exemplo@dominio.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: "" })); }}
          className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border focus:bg-white focus:ring-4 focus:ring-green-50 outline-none transition-all ${errors.email ? "border-red-400" : "border-slate-200 focus:border-[#1E7A3C]"}`}
        />
        {errors.email && <span className="text-xs text-red-500 ml-1">{errors.email}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center ml-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Senha
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs font-bold text-[#1E7A3C] hover:text-[#165a2d] transition-colors"
          >
            Esqueceu a senha?
          </button>
        </div>
        <Input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: "" })); }}
          className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border focus:bg-white focus:ring-4 focus:ring-green-50 outline-none transition-all ${errors.password ? "border-red-400" : "border-slate-200 focus:border-[#1E7A3C]"}`}
        />
        {errors.password && <span className="text-xs text-red-500 ml-1">{errors.password}</span>}
      </div>

      <Button
        onClick={login}
        disabled={loading}
        text={loading ? "Verificando..." : "Entrar no Sistema"}
        className="w-full bg-[#1E7A3C] hover:bg-[#165a2d] text-white font-bold py-4 rounded-2xl shadow-xl shadow-green-100/30 transition-all active:scale-[0.98] disabled:opacity-70"
      />
    </div>
  );
}

export default LoginForm;
