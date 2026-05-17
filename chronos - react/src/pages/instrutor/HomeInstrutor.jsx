import { Home } from "lucide-react";
import { Play, Calendar, Users } from "@phosphor-icons/react";

import Acoes from "../../components/homeSecretario/Acoes";
import Evento from "../../components/homeSecretario/Evento";
import Header from "../../components/homeSecretario/Header";
import Sidebar from "../../components/sidebar/SideBar";
import Cronograma from "../../components/homeInstrutor/Cronograma";

function HomeInstrutor() {
  const abrirTelaPresenca = () => {
    console.log("Abrindo tela de Marcar Presença...");
  };

  const abrirTelaAgenda = () => {
    console.log("Abrindo tela de Minha Agenda...");
  };

  const abrirTelaTurmas = () => {
    console.log("Abrindo tela de Minhas Turmas...");
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      <Sidebar tipoUsuario="instrutor" />

      {/* Painel Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header titulo="Home" icone={Home} />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1600px] mx-auto p-8 flex flex-col gap-8">
            <div className="flex flex-col xl:flex-row gap-8 items-start">
              {/* Coluna da Esquerda (Conteúdo Dinâmico) */}
              <div className="flex-1 flex flex-col gap-8 min-w-0 w-full">
                <div className="overflow-hidden">
                  {/* Chamando o componente e injetando os dados e funções diretamente por props */}
                  <Acoes
                    acoes={[
                      {
                        id: "presenca",
                        label: "Marcar Presença",
                        subLabel: "Aula em andamento agora",
                        icon: Play,
                        isPrimary: true,
                        onClick: abrirTelaPresenca,
                      },
                      {
                        id: "agenda",
                        label: "Minha Agenda",
                        icon: Calendar,
                        onClick: abrirTelaAgenda,
                      },
                      {
                        id: "turmas",
                        label: "Minhas Turmas",
                        icon: Users,
                        onClick: abrirTelaTurmas,
                      },
                    ]}
                  />
                </div>

                <div>
                  <Cronograma />
                </div>
              </div>

              {/* Coluna da Direita (Eventos / Sidebar de Contexto) */}
              <aside className="w-full xl:w-[500px] shrink-0 sticky top-0">
                <div className="overflow-hidden">
                  <Evento />
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default HomeInstrutor;
