import Search from "lucide-react/icons/search";
import UserPlus from "lucide-react/icons/user-plus";

export default function BarraAcoes({
  termoBusca = "",
  onBuscaChange,
  onNovoClick,
}) {
  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
      <label className="relative min-w-0 flex-1 lg:w-72 lg:flex-none">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
          aria-hidden="true"
        />
        <input
          value={termoBusca}
          onChange={(event) => onBuscaChange?.(event.target.value)}
          type="text"
          aria-label="Buscar usuários por nome ou e-mail"
          placeholder="Buscar por nome ou e-mail"
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 shadow-sm transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/15"
        />
      </label>
      <button
        type="button"
        onClick={onNovoClick}
        className="flex items-center justify-center gap-2 rounded-xl bg-[#1E7A3C] px-5 py-3 text-sm font-bold text-white shadow-sm shadow-emerald-900/10 transition-all hover:bg-[#165a2d] active:scale-[0.98]"
      >
        <UserPlus size={18} />
        Novo Usuário
      </button>
    </div>
  );
}
