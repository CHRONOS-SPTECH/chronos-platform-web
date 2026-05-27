import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { Play, Calendar, Users } from "@phosphor-icons/react";

import Acoes from "../../components/homeSecretario/Acoes";
import Evento from "../../components/homeSecretario/Evento";
import Header from "../../components/homeSecretario/Header";
import Sidebar from "../../components/sidebar/SideBar";
import Cronograma from "../../components/homeInstrutor/Cronograma";
import api from "../../services/api";
import { getHojeIso } from "../../utils/dateUtils";

function HomeInstrutor() {
  const navigate = useNavigate();
  const [aula, setAula] = useState(null);

  useEffect(() => {
    const carregarAulas = async () => {
      try {
        const dados = sessionStorage.getItem("usuario");
        if (!dados) return;

        const user = JSON.parse(dados);
        const hoje = getHojeIso();

        const res = await api.get(
          `/aulas/dia?data=${hoje}&instrutorId=${user.id_usuario}`,
        );

        if (res.data?.length > 0) {
          setAula(res.data[0]);
        }
      } catch (err) {
        console.error("Erro ao buscar aulas:", err);
      }
    };

    carregarAulas();
  }, []);

  const iniciarPresenca = (idTurma, idAula) => {
    if (!idTurma || !idAula) {
      alert("Nenhuma aula em andamento encontrada para hoje.");
      return;
    }
    navigate(`/presenca/${idTurma}/${idAula}`);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      <Sidebar tipoUsuario="instrutor" />

      <div className="flex-1 flex flex-col min-w-0">
        <Header titulo="Home" icone={Home} />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1600px] mx-auto p-8 flex flex-col gap-8">
            <div className="flex flex-col xl:flex-row gap-8 items-start">
              <div className="flex-1 flex flex-col gap-8 min-w-0 w-full">
                <div className="overflow-hidden">
                  <Acoes
                    acoes={[
                      {
                        id: "presenca",
                        label: "Marcar Presença",
                        subLabel: aula
                          ? `Aula da turma ${aula.aula?.id_turma || ""}`
                          : "Nenhuma aula para hoje",
                        icon: Play,
                        isPrimary: true,
                        onClick: () =>
                          iniciarPresenca(
                            aula?.aula?.id_turma,
                            aula?.aula?.id_aula,
                          ),
                      },
                      {
                        id: "agenda",
                        label: "Minha Agenda",
                        icon: Calendar,
                        onClick: () => console.log("Agenda"),
                      },
                      {
                        id: "turmas",
                        label: "Minhas Turmas",
                        icon: Users,
                        onClick: () => console.log("Turmas"),
                      },
                    ]}
                  />
                </div>

                <div>
                  <Cronograma />
                </div>
              </div>

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
