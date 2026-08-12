import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import sessionService from "../services/sessionService";

export default function useHeader() {
  const navigate = useNavigate();
  const [perfilAberto, setPerfilAberto] = useState(false);
  const [dataAtual, setDataAtual] = useState("");

  useEffect(() => {
    const hoje = new Date();
    const formatador = new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const dataFormatada = formatador.format(hoje);
    setDataAtual(
      dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1),
    );
  }, []);

  let dadosSessao = { nome: "Usuário", cargo: "Membro", avatar: null };

  try {
    const sessao = sessionService.getSession();
    const perfilSelecionado = sessionService.getSelectedProfile() || "Membro";

    if (sessao) {
      dadosSessao = {
        nome: sessao.usuario?.pessoa?.nome || "Usuário",
        cargo: perfilSelecionado,
        avatar: sessao.usuario?.pessoa?.url_foto_perfil || null,
      };
    }
  } catch (error) {
    console.error("Erro ao ler dados da sessão", error);
  }

  const trocarPerfil = useCallback(() => {
    setPerfilAberto(false);
    navigate("/perfis");
  }, [navigate]);

  const logout = useCallback(() => {
    setPerfilAberto(false);
    sessionService.clearSession();
    navigate("/login");
  }, [navigate]);

  return {
    perfilAberto,
    setPerfilAberto,
    dataAtual,
    dadosSessao,
    trocarPerfil,
    logout,
  };
}
