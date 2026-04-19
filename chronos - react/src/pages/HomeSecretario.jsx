import Acoes from "../components/homeSecretario/Acoes";
import Evento from "../components/homeSecretario/Evento";
import Header from "../components/homeSecretario/Header";
import Profile from "../components/homeSecretario/Profile";
import Sidebar from "../components/homeSecretario/SideBar";
import VisaoGeral from "../components/homeSecretario/VisaoGeral";
import { UserPlus, Users, CalendarPlus } from "lucide-react";

function HomeSecretario() {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar
        usuario={{ inicial: "H", nome: "Henrique" }}
        secoes={[
          {
            label: "Operacional",
            titulo: "Gestão Acadêmica",
            icone: <Users size={20} />,
            itens: ["Alunos", "Turmas", "Eventos"],
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
            <Profile nome="Henrique" cargo="Secretário" />

            {/* Grid principal */}
            <div className="flex gap-6 items-start justify-between">

              {/* Ações */}
              <div className="flex-1 flex flex-col gap-6">
                <Acoes
                  titulo="MINHAS AÇÕES"
                  acaoPrincipal={{ texto: "+ Novo Aluno", icone: <UserPlus size={24} /> }}
                  acoesSecundarias={[
                    { texto: "Matricular em Turma", icone: <Users size={20} /> },
                    { texto: "Adicionar Evento", icone: <CalendarPlus size={20} /> },
                  ]}
                />
                <VisaoGeral />
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

export default HomeSecretario;