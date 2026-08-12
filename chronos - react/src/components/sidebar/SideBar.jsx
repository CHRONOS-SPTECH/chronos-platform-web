import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, ChevronDown, ChevronRight, LayoutGrid } from "lucide-react";
import { MENU_CONFIG } from "../../config/navigation";
import aulaService from "../../services/aulaService";
import sessionService from "../../services/sessionService";
import { getHojeIso } from "../../utils/DateUtils";

const getTipoUsuarioFromSession = (dadosSessao) => {
  if (!dadosSessao || !Array.isArray(dadosSessao.perfis)) return null;

  const perfisUsuario = dadosSessao.perfis.map((p) =>
    String(p.nome_perfil)
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim(),
  );

  if (perfisUsuario.includes("administrador")) return "Administrador";
  if (perfisUsuario.includes("secretario")) return "secretario";
  return "instrutor";
};

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const dadosSessao = sessionService.getSession();
  const tipoUsuarioSessao = getTipoUsuarioFromSession(dadosSessao);
  const selectedProfile = sessionService.getSelectedProfile();

  const activeTipoUsuario = selectedProfile || tipoUsuarioSessao || "instrutor";
  const config = MENU_CONFIG[activeTipoUsuario] || MENU_CONFIG["instrutor"];

  const [abertos, setAbertos] = useState({ 0: true });

  const abrirItemMenu = async (item) => {
    if (item.action === "chamadaDoDia") {
      try {
        if (!dadosSessao?.usuario) {
          alert("Sessão inválida. Faça login novamente.");
          return navigate("/instrutor");
        }

        const hoje = getHojeIso();
        const aulasHoje =
          (await aulaService.listarAulasDoDia(
            dadosSessao.usuario.id_usuario,
            hoje,
          )) || [];
        const aulaEmAberto = aulasHoje.find(
          (itemAula) =>
            !Boolean(itemAula?.chamadaFeita ?? itemAula?.aula?.chamadaFeita),
        );
        const aulaParaAbrir = aulaEmAberto || aulasHoje[0];

        if (aulaParaAbrir?.aula?.id_turma && aulaParaAbrir?.aula?.id_aula) {
          navigate(
            `/presenca/${aulaParaAbrir.aula.id_turma}/${aulaParaAbrir.aula.id_aula}`,
          );
          return;
        }

        alert("Nenhuma aula agendada para hoje.");
        return;
      } catch (err) {
        console.error("Erro ao abrir a chamada do dia:", err);
        alert(
          "Não foi possível carregar a chamada do dia. Verifique sua conexão ou faça login novamente.",
        );
        return;
      }
    }

    if (item.rota) navigate(item.rota);
  };

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
