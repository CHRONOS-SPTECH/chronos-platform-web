import Acoes from "../components/homeSecretario/Acoes";
import Evento from "../components/homeSecretario/Evento";
import Header from "../components/homeSecretario/Header";
import Profile from "../components/homeSecretario/Profile";
import Sidebar from "../components/homeSecretario/SideBar";
import Cronograma from "../components/homeInstrutor/Cronograma";
import { CheckSquare, Users, CalendarDays } from "lucide-react";

function HomeInstrutor() {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* Sidebar */}
      <Sidebar
        usuario={{ inicial: "H", nome: "Henrique" }}
        secoes={[
          {
            label: "Acadêmico",
            titulo: "Controle de Frequência",
            icone: <Users size={20} />,
            itens: ["Chamada do dia", "Minhas Turmas", "Minha Agenda"],
          },
        ]}
      />

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col h-screen">

        {/* Header fixo */}
        <Header />

        {/* Área com scroll */}
        <div className="flex-1 overflow-y-auto">

          <div className="p-6 flex flex-col gap-6">

            {/* Perfil */}
            <Profile nome="Henrique" cargo="Instrutor" />

            {/* Grid principal */}
            <div className="flex gap-6 items-start justify-between">

              {/* Ações + Cronograma */}
              <div className="flex-1 flex flex-col gap-6">
                <Acoes
                  titulo="MINHAS AÇÕES"
                  acaoPrincipal={{ texto: "Marcar Presença Agora", icone: <CheckSquare size={24} /> }}
                  acoesSecundarias={[
                    { texto: "Minha Agenda", icone: <CalendarDays size={20} /> },
                    { texto: "Minhas Turmas", icone: <Users size={20} /> },
                  ]}
                />
                <Cronograma />
              </div>

              {/* Eventos */}
              <div className="w-[380px] shrink-0">
                <Evento />
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default HomeInstrutor;