import { useEffect, useState } from "react";
import logoCronos from "../assets/logoChronos.svg";
import Card from "../components/perfis/Card";
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

function Perfils() {
  const [perfisDisponiveis, setPerfisDisponiveis] = useState([]);

  useEffect(() => {
    const dadosSessao = sessionService.getSession();

    if (dadosSessao && Array.isArray(dadosSessao.perfis)) {
      const cardsFiltrados = [];

      dadosSessao.perfis.forEach((p) => {
        const nomeNormalizado = String(p.nome_perfil)
          .toLowerCase()
          .normalize("NFKD")
          .replace(/[\u0300-\u036f]/g, "")
          .trim();

        if (nomeNormalizado.includes("admin") && CONFIG_CARDS.administrador) {
          cardsFiltrados.push({
            id: p.id_perfil,
            ...CONFIG_CARDS.administrador,
          });
        } else if (
          nomeNormalizado.includes("secret") &&
          CONFIG_CARDS.secretario
        ) {
          cardsFiltrados.push({ id: p.id_perfil, ...CONFIG_CARDS.secretario });
        } else if (
          (nomeNormalizado.includes("instrutor") ||
            nomeNormalizado.includes("diretor")) &&
          CONFIG_CARDS.instrutor
        ) {
          // Evita duplicar o card caso ele venha como Instrutor E Diretor no banco (já que compartilham o menu/dashboard)
          if (!cardsFiltrados.some((c) => c.rota === "/instrutor")) {
            cardsFiltrados.push({ id: p.id_perfil, ...CONFIG_CARDS.instrutor });
          }
        }
      });

      setPerfisDisponiveis(cardsFiltrados);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#eef1f6] flex flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-3 mt-6">
        <img src={logoCronos} alt="LogoChronos" className="w-28 mb-4" />
        <h1 className="text-2xl font-bold text-[#1E7A3C]">
          Bem-vindo ao Chronos
        </h1>
      </div>
      <p className="text-gray-500">
        Selecione o perfil de acesso para continuar
      </p>

      <div className="flex gap-6 flex-wrap justify-center">
        {perfisDisponiveis.map((perfil) => (
          <Card
            key={perfil.id}
            tipo={perfil.tipo}
            descricao={perfil.descricao}
            badge={perfil.badge}
            rota={perfil.rota}
          />
        ))}

        {perfisDisponiveis.length === 0 && (
          <p className="text-sm text-red-500">
            Nenhum perfil de acesso encontrado para este usuário.
          </p>
        )}
      </div>
    </div>
  );
}

export default Perfils;
