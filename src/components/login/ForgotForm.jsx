import { useState } from "react";
import Input from "../Input";
import Button from "../Button";

function ForgotForm({ onBack }) {
  const [email, setEmail] = useState("");

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
          E-mail de recuperação
        </label>
        <Input
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#1E7A3C] outline-none transition-all"
        />
      </div>

      <Button
        text="Enviar Link"
        className="w-full bg-[#1E7A3C] hover:bg-[#165a2d] text-white font-bold py-4 rounded-xl shadow-sm transition-all"
      />

      <button
        onClick={onBack}
        className="w-full text-center text-sm font-semibold text-slate-400 hover:text-slate-800 transition-colors"
      >
        Voltar para o login
      </button>
    </div>
  );
}

export default ForgotForm;
