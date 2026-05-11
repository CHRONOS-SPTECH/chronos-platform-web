import { House, Calendar } from "@phosphor-icons/react";

function Header({ titulo = "Dashboard", icone: Icone = Home }) {
  return (
    <header className="w-full flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-slate-100 h-[72px] sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
          <Icone size={20} weight="bold" />
        </div>
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
          {titulo}
        </h3>
      </div>

      <div className="flex items-center gap-6">
        {/* Data com visual técnico */}
        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
          <Calendar size={18} weight="bold" className="text-[#1E7A3C]" />
          <p className="text-[11px] font-black text-slate-600 uppercase tracking-tighter">
            Sábado, 18 de Abril de 2026
          </p>
        </div>

        {/* Ponto de notificação ou separador visual */}
        <div className="w-[1px] h-6 bg-slate-200"></div>

        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div>
      </div>
    </header>
  );
}

export default Header;
