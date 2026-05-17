import { Home, UserPlus, Users, CalendarPlus } from "lucide-react";

import Acoes from "../../components/homeSecretario/Acoes";
import Evento from "../../components/homeSecretario/Evento";
import Header from "../../components/homeSecretario/Header";
import Sidebar from "../../components/sidebar/SideBar";
import VisaoGeral from "../../components/homeSecretario/VisaoGeral";

function HomeSecretario() {
  const cadastrarAluno = () => {
    console.log("Abrindo tela de cadastro de Novo Aluno...");
  };

  const matricularAluno = () => {
    console.log("Abrindo tela de Matrícula em Turma...");
  };

  const criarEvento = () => {
    console.log("Abrindo tela de Adicionar Evento...");
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar tipoUsuario="secretario" />

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Header fixo */}
        <Header titulo="Home" icone={Home} />

        {/* Área com scroll */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 flex flex-col gap-6">
            {/* Grid principal */}
            <div className="flex gap-6 items-start justify-between">
              {/* Coluna da Esquerda (Ações e Visão Geral) */}
              <div className="flex-1 flex flex-col gap-6">
                {/* Chamando o componente dinâmico manualmente por props */}
                <Acoes
                  acoes={[
                    {
                      id: "novo-aluno",
                      label: "Novo Aluno",
                      subLabel: "Cadastrar no sistema", // Opcional, se o layout aceitar
                      icon: UserPlus,
                      isPrimary: true, // Ocupa 2 colunas e tem destaque
                      onClick: cadastrarAluno,
                    },
                    {
                      id: "matricular",
                      label: "Matricular em Turma",
                      icon: Users,
                      onClick: matricularAluno,
                    },
                    {
                      id: "novo-evento",
                      label: "Adicionar Evento",
                      icon: CalendarPlus,
                      onClick: criarEvento,
                    },
                  ]}
                />

                <VisaoGeral />
              </div>

              {/* Coluna da Direita (Eventos) */}
              <div className="w-[500px] shrink-0">
                <Evento />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeSecretario;
