import { useState } from "react";
import LoginForm from "../components/login/LoginForm";
import ForgotForm from "../components/login/ForgotForm";
import Alert from "../components/alert-toast/AlertToast";
import logoChronos from "../assets/logoChronos.svg";

function Login() {
  const [view, setView] = useState("login");
  const [status, setStatus] = useState({ type: "", message: "" });

  const atualizarStatus = (novoStatus) => {
    setStatus(novoStatus);
    if (novoStatus.message) {
      setTimeout(() => setStatus({ type: "", message: "" }), 4000);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#FDFDFD] font-['Inter']">
      <Alert type={status.type} message={status.message} />

      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] relative items-center justify-center overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#2bab56] rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-[#297141] rounded-full blur-[100px] opacity-30"></div>

        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

        <div className="z-10 max-w-md p-4">
          <div className="inline-block px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-bold tracking-[0.2em] mb-6">
            CHRONOS
          </div>
          <h2 className="text-white text-5xl font-extrabold leading-[1.1] tracking-tighter mb-6">
            Sistema de Gestão <br />{" "}
            <span className="text-[#1E7A3C]">Acadêmica.</span>
          </h2>
          <p className="text-slate-400 text-lg font-light leading-relaxed">
            Acompanhe ciclos, presenças e desempenho em uma única plataforma
            centralizada.
          </p>
        </div>
      </div>

      {/* Lado Direito: Formulário Executivo */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-12">
            <img src={logoChronos} alt="Logo Chronos" className="h-12 mb-10" />
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {view === "login" ? "Entrar na conta" : "Recuperação"}
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              {view === "login"
                ? "Bem-vindo ao Chronos. Por favor, identifique-se."
                : "Insira seu e-mail para resetar sua senha."}
            </p>
          </div>

          <div className="transition-all duration-300">
            {view === "login" ? (
              <LoginForm
                onForgotPassword={() => setView("forgot")}
                onStatusChange={atualizarStatus}
              />
            ) : (
              <ForgotForm
                onBack={() => setView("login")}
                onStatusChange={atualizarStatus}
              />
            )}
          </div>

          <footer className="mt-10 pt-8 border-t border-slate-100 flex justify-between items-center">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
              © 2026 Nova Acrópole
            </span>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                Status: Online
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Login;
