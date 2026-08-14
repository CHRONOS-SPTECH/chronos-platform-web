import { Home, ChevronDown, ChevronRight, LayoutGrid } from "lucide-react";
import useSidebar from "../../hooks/useSidebar";

export default function Sidebar() {
  const { config, location, navigate, abertos, alternarSecao, abrirItemMenu } =
    useSidebar();

  return (
    <aside className="w-70 h-screen bg-[#00871D] text-white flex flex-col shadow-xl shrink-0">
      <div className="px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <LayoutGrid className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            CHRONOS
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar">
        <button
          onClick={() => navigate(config.dashboardPath)}
          className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all mb-2 ${
            location.pathname === config.dashboardPath
              ? "bg-white text-[#00871D] shadow-md"
              : "hover:bg-white/5"
          }`}
        >
          <Home size={22} strokeWidth={2.5} />
          <span className="text-sm font-bold">Home</span>
        </button>

        {config.secoes.map((secao, i) => (
          <div key={i} className="flex flex-col gap-1 mt-6">
            <p className="text-[11px] text-green-200/60 font-bold mb-4 px-4 uppercase tracking-[0.2em]">
              {secao.label}
            </p>
            <div
              className="flex items-center justify-between px-4 py-3.5 rounded-2xl cursor-pointer bg-white/10"
              onClick={() => alternarSecao(i)}
            >
              <div className="flex items-center gap-4">
                <div className="text-white">{secao.icone}</div>
                <span className="text-sm font-bold">{secao.titulo}</span>
              </div>
              {abertos[i] ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </div>

            {abertos[i] && (
              <div className="ml-10 mt-1 flex flex-col border-l border-white/10">
                {secao.itens.map((item, j) => (
                  <div
                    key={j}
                    onClick={() => abrirItemMenu(item)}
                    className={`py-3 px-6 text-sm font-medium cursor-pointer transition-all rounded-r-lg ${
                      location.pathname === item.rota
                        ? "text-white bg-white/20"
                        : "text-green-50/70 hover:text-white"
                    }`}
                  >
                    {item.nome}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
