import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { MENU_CONFIG } from "../config/navigation";
import aulaService from "../services/aulaService";
import sessionService from "../services/sessionService";
import { useToast } from "../components/alert-toast/ToastProvider";
import { getHojeIso } from "../utils/DateUtils";

const getTipoUsuarioFromSession = (dadosSessao) => {
  if (!dadosSessao || !Array.isArray(dadosSessao.perfis)) return null;

  const perfisUsuario = dadosSessao.perfis.map((perfil) =>
    String(perfil.nome_perfil)
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim(),
  );

  if (perfisUsuario.includes("administrador")) return "Administrador";
  if (perfisUsuario.includes("secretario")) return "secretario";
  return "instrutor";
};

export default function useSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [abertos, setAbertos] = useState({ 0: true });

  const dadosSessao = sessionService.getSession();
  const tipoUsuarioSessao = getTipoUsuarioFromSession(dadosSessao);
  const perfilSelecionado = sessionService.getSelectedProfile();
  const tipoUsuarioAtivo =
    perfilSelecionado || tipoUsuarioSessao || "instrutor";
  const config = MENU_CONFIG[tipoUsuarioAtivo] || MENU_CONFIG["instrutor"];

  const abrirItemMenu = useCallback(
    async (item) => {
      if (item.action === "chamadaDoDia") {
        try {
          if (!dadosSessao?.usuario) {
            toast.error("Sessão inválida. Faça login novamente.");
            navigate("/instrutor");
            return;
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

          toast.error("Nenhuma aula agendada para hoje.");
          return;
        } catch (erro) {
          console.error("Erro ao abrir a chamada do dia:", erro);
          toast.error(
            "Não foi possível carregar a chamada do dia. Verifique sua conexão ou faça login novamente.",
          );
          return;
        }
      }

      if (item.rota) {
        navigate(item.rota);
      }
    },
    [dadosSessao, navigate, toast],
  );

  const alternarSecao = useCallback((indiceSecao) => {
    setAbertos((abertosAtuais) => ({
      ...abertosAtuais,
      [indiceSecao]: !abertosAtuais[indiceSecao],
    }));
  }, []);

  return {
    config,
    location,
    navigate,
    abertos,
    alternarSecao,
    abrirItemMenu,
  };
}
