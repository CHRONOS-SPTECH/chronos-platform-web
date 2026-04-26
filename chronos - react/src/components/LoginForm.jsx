import { useState } from "react";
import Input from "./Input";
import Button from "./Button";

import authService from "../services/authService";

function LoginForm() {
  const [email, setEmail] = useState("usuario@gmail.com");
  const [password, setPassword] = useState("senhaSegura123");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function login() {
    localStorage.removeItem("token");

    setStatus({ type: "", message: "" });
    setLoading(true);

    try {
      const data = await authService.login(email, password);

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      console.log("Login bem-sucedido:", data);

      setStatus({ type: "success", message: "Sucesso! Redirecionando..." });

      setTimeout(() => {
        window.location.href = "/perfis";
      }, 1000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "E-mail ou senha incorretos.";
      setStatus({ type: "error", message: errorMsg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {status.message && (
        <div
          className={`p-4 rounded-xl text-sm font-medium border ${
            status.type === "error"
              ? "bg-red-50 text-red-600 border-red-100"
              : "bg-green-50 text-green-600 border-green-100"
          }`}
        >
          {status.message}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
          E-mail de acesso
        </label>
        <Input
          name="email"
          type="email"
          placeholder="nome@empresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-50 outline-none transition-all placeholder:text-slate-300"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center ml-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Senha
          </label>
          <button className="text-xs font-bold text-green-600 hover:text-green-700 transition-colors">
            Esqueceu?
          </button>
        </div>
        <Input
          name="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-50 outline-none transition-all placeholder:text-slate-300"
        />
      </div>

      <Button
        onClick={login}
        disabled={loading}
        type="button"
        text={loading ? "Entrando..." : "Login"}
        className="w-full bg-[#1E7A3C] hover:bg-[#165a2d] text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-200/50 transition-all disabled:opacity-60"
      />
    </div>
  );
}

export default LoginForm;
