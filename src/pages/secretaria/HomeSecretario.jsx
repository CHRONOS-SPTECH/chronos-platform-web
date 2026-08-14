import { Home, UserPlus, Users, CalendarPlus } from "lucide-react";

import Acoes from "../../components/homeSecretario/Acoes";
import Evento from "../../components/homeSecretario/Evento";
import Header from "../../components/homeSecretario/Header";
import Sidebar from "../../components/sidebar/SideBar";
import VisaoGeral from "../../components/homeSecretario/VisaoGeral";
import DiarioRecente from "../../components/homeSecretario/DiarioRecente";
import { useNavigate } from "react-router-dom";

function HomeSecretario() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen">
        <Header titulo="Home" icone={Home} />

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 flex flex-col gap-6">
            <div className="flex gap-6 items-start justify-between">
              <div className="flex-1 flex flex-col gap-6">
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

                {/* <VisaoGeral /> */}

                {/* Componente dinâmico que bate direto no @GetMapping("/detalhadadas") */}
                <DiarioRecente />
              </div>

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
