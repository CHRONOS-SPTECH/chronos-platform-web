import { Search, UserPlus } from "lucide-react";

export default function BarraAcoes({ onNovoClick }) {
  return (
    <div className="flex gap-4">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Buscar usuários..."
          className="w-72 rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 shadow-sm transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/15"
        />
      </div>
      <button
        onClick={onNovoClick}
        className="flex items-center gap-2 rounded-xl bg-[#1E7A3C] px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-emerald-900/10 transition-all hover:bg-[#165a2d] active:scale-[0.98]"
      >
        <UserPlus size={18} />
        Novo Usuário
      </button>
    </div>
  );
}
