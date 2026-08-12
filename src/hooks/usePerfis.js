import { useCallback, useEffect, useState } from "react";

import sessionService from "../services/sessionService";

const CONFIG_CARDS = {
  administrador: {
    tipo: "Administrador",
    descricao: "Gestão total de alunos, turmas, finanças e voluntários.",
    badge: "Acesso Total",
    rota: "/administrador",
  },
  instrutor: {
    tipo: "Instrutor",
    descricao: "Lançamento de presenças, aulas e desempenho do aluno",
    badge: "Acesso Docente",
    rota: "/instrutor",
  },
  secretario: {
    tipo: "Secretária",
    descricao: "Matrículas, documentos e atendimento ao aluno.",
    badge: "Acesso Operacional",
    rota: "/secretario",
  },
};

const normalizarNomePerfil = (nomePerfil) =>
  String(nomePerfil)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export default function usePerfis() {
  const [perfisDisponiveis, setPerfisDisponiveis] = useState([]);

  const carregarPerfis = useCallback(() => {
    const dadosSessao = sessionService.getSession();

    if (!dadosSessao || !Array.isArray(dadosSessao.perfis)) {
      setPerfisDisponiveis([]);
      return;
    }

    const cardsFiltrados = [];

    dadosSessao.perfis.forEach((perfil) => {
      const nomeNormalizado = normalizarNomePerfil(perfil.nome_perfil);

      if (nomeNormalizado.includes("admin") && CONFIG_CARDS.administrador) {
        cardsFiltrados.push({
          id: perfil.id_perfil,
          ...CONFIG_CARDS.administrador,
        });
      } else if (
        nomeNormalizado.includes("secret") &&
        CONFIG_CARDS.secretario
      ) {
        cardsFiltrados.push({
          id: perfil.id_perfil,
          ...CONFIG_CARDS.secretario,
        });
      } else if (
        (nomeNormalizado.includes("instrutor") ||
          nomeNormalizado.includes("diretor")) &&
        CONFIG_CARDS.instrutor
      ) {
        const jaExistePerfilInstrutor = cardsFiltrados.some(
          (card) => card.rota === "/instrutor",
        );

        if (!jaExistePerfilInstrutor) {
          cardsFiltrados.push({
            id: perfil.id_perfil,
            ...CONFIG_CARDS.instrutor,
          });
        }
      }
    });

    setPerfisDisponiveis(cardsFiltrados);
  }, []);

  useEffect(() => {
    carregarPerfis();
  }, [carregarPerfis]);

  return {
    perfisDisponiveis,
    carregarPerfis,
  };
}
