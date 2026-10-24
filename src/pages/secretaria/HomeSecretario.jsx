import { Home, UserPlus, Users, CalendarPlus } from "lucide-react";

import Acoes from "../../components/homeSecretario/Acoes";
import Evento from "../../components/homeSecretario/Evento";
import Header from "../../components/homeSecretario/Header";
import Sidebar from "../../components/sidebar/SideBar";
import AcompanhamentoSecretaria from "../../components/homeSecretario/AcompanhamentoSecretaria";
import { useNavigate } from "react-router-dom";

function HomeSecretario() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen">
        <Header titulo="Home" icone={Home} />

        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="h-full min-h-0 p-4 lg:p-5 flex flex-col gap-4 lg:gap-5">
            <div className="flex h-full min-h-0 gap-4 lg:gap-5 items-stretch justify-between">
              <div className="min-w-0 min-h-0 flex-1 flex flex-col gap-4 lg:gap-5">
                <Acoes
                  acoes={[
                    {
                      id: "novo-aluno",
                      label: "Novo Aluno",
                      subLabel: "Cadastrar no sistema",
                      icon: UserPlus,
                      isPrimary: true,
                      onClick: () => navigate("/alunos"),
                    },
                    {
                      id: "nova-turma",
                      label: "Criar Turma",
                      subLabel: "Gerenciar turmas",
                      icon: Users,
                      onClick: () => navigate("/turmas"),
                    },
                    {
                      id: "cronograma",
                      label: "Ver Cronograma",
                      subLabel: "Acompanhar aulas",
                      icon: CalendarPlus,
                      onClick: () => navigate("/cronograma"),
                    },
                  ]}
                />

                <div className="min-h-0 flex-1">
                  <AcompanhamentoSecretaria />
                </div>
              </div>

              <div className="h-full w-[500px] shrink-0 overflow-hidden">
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
