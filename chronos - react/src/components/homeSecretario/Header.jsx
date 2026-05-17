import { useState } from "react";
import { House, Calendar, SignOut, Gear, User } from "@phosphor-icons/react";
import Profile from "./Profile";

function Header({
  titulo = "Dashboard",
  icone: Icone = House,
  usuario = { nome: "Henrique Souza", cargo: "Membro" },
  avatar = null,
}) {
  const [perfilAberto, setPerfilAberto] = useState(false);

  const handleLogout = () => console.log("Logout executado");
  const handleConfiguracoes = () => console.log("Abrindo configurações");

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
        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
          <Calendar size={18} weight="bold" className="text-[#1E7A3C]" />
          <p className="text-[11px] font-black text-slate-600 uppercase tracking-tighter">
            Sábado, 18 de Abril de 2026
          </p>
        </div>

        <div className="w-[1px] h-6 bg-slate-200"></div>

        <div className="relative">
          <button onClick={() => setPerfilAberto(!perfilAberto)}>
            <Profile
              nome={usuario.nome}
              cargo={usuario.cargo}
              avatar={avatar || undefined}
            />
          </button>

          {/* Dropdown Menu */}
          {perfilAberto && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="py-1">
                <button
                  onClick={() => {
                    handleConfiguracoes();
                    setPerfilAberto(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium"
                >
                  <User size={16} className="text-slate-400" />
                  Meu Perfil
                </button>

                <button
                  onClick={() => {
                    handleConfiguracoes();
                    setPerfilAberto(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium"
                >
                  <Gear size={16} className="text-slate-400" />
                  Configurações
                </button>

                <div className="h-px bg-slate-100 my-1"></div>

                <button
                  onClick={() => {
                    handleLogout();
                    setPerfilAberto(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  <SignOut size={16} className="text-red-400" />
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
