// src/components/sidebar/SideBar.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  LogOut,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";
import { MENU_CONFIG } from "../../config/navigation";

export default function Sidebar({
  tipoUsuario = "instrutor",
  usuario = { inicial: "H", nome: "Henrique" },
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const config = MENU_CONFIG[tipoUsuario];

  const [abertos, setAbertos] = useState({ 0: true });

  return (
    <aside className="w-[280px] h-screen bg-[#00871D] text-white flex flex-col shadow-xl shrink-0">
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

      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="bg-white text-[#00871D] font-bold text-lg w-12 h-12 flex items-center justify-center rounded-2xl shadow-lg">
          {usuario.inicial}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-white text-base leading-none">
            {usuario.nome}
          </span>
          <span className="text-[10px] text-green-200 font-bold mt-1.5 uppercase tracking-widest opacity-80">
            {tipoUsuario === "instrutor" ? "Instrutor" : "Secretário"}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 overflow-y-auto">
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
              onClick={() => setAbertos({ ...abertos, [i]: !abertos[i] })}
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
                    onClick={() => navigate(item.rota)}
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

      {/* Footer */}
      <div className="p-4 mt-auto border-t border-white/10">
        <button
          onClick={() => navigate("/login")}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-green-100 font-bold hover:bg-red-500 hover:text-white transition-all"
        >
          <LogOut size={22} strokeWidth={2.5} />
          <span className="text-sm">Sair</span>
        </button>
      </div>
    </aside>
  );
}
