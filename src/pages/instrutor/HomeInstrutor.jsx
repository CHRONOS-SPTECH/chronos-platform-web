import { useNavigate } from "react-router-dom";
import Home from "lucide-react/icons/house";
import { Play } from "@phosphor-icons/react/dist/csr/Play";
import { Calendar } from "@phosphor-icons/react/dist/csr/Calendar";
import { Users } from "@phosphor-icons/react/dist/csr/Users";

import Acoes from "../../components/features/home-secretario/Acoes";
import Evento from "../../components/features/home-secretario/Evento";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import Cronograma from "../../components/features/home-instrutor/Cronograma";
import { useToast } from "../../components/feedback/ToastProvider";
import useHomeInstrutor from "../../hooks/useHomeInstrutor";

function HomeInstrutor() {
  const navigate = useNavigate();
  const toast = useToast();
  const { aula, iniciarPresenca } = useHomeInstrutor();

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* Sidebar limpa e auto-adaptável */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header titulo="Home" icone={Home} />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-400 mx-auto p-8 flex flex-col gap-8">
            <div className="flex flex-col xl:flex-row gap-8 items-start">
              <div className="flex-1 flex flex-col gap-8 min-w-0 w-full">
                <div className="overflow-hidden">
                  <Acoes
                    acoes={[
                      {
                        id: "presenca",
                        label: "Marcar Presença",
                        subLabel:
                          aula &&
                          !Boolean(
                            aula?.chamadaFeita ?? aula?.aula?.chamadaFeita,
                          )
                            ? `Próxima chamada: turma ${aula.aula?.id_turma || ""} • aula ${aula.aula?.id_aula || ""}`
                            : "",
                        icon: Play,
                        isPrimary: true,
                        onClick: iniciarPresenca,
                      },
                      {
                        id: "agenda",
                        label: "Minha Agenda",
                        icon: Calendar,
                        onClick: () => navigate("/minha-agenda"),
                      },
                      {
                        id: "em-desenvolvimento",
                        label: "Em Desenvolvimento",
                        icon: Users,
                        onClick: () =>
                          toast.success(
                            "Esta funcionalidade está em desenvolvimento e será disponibilizada em breve.",
                          ),
                        isDisabled: true,
                      },
                    ]}
                  />
                </div>
                <div>
                  <Cronograma />
                </div>
              </div>

              <aside className="w-full xl:w-125 shrink-0 sticky top-0">
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
