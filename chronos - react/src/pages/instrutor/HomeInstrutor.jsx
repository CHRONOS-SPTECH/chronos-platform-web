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

  const selecionarAulaParaPresenca = (aulasHoje) => {
    const aulaEmAberto = aulasHoje.find(
      (item) => !Boolean(item?.chamadaFeita ?? item?.aula?.chamadaFeita),
    );
    return aulaEmAberto || aulasHoje[0] || null;
  };

  useEffect(() => {
    const carregarAulas = async () => {
      try {
        const dados = JSON.parse(sessionStorage.getItem("usuario"));
        if (!dados?.usuario) return;

        const hoje = getHojeIso();
        console.log(
          "Buscando aulas para hoje:",
          hoje,
          "e instrutorId:",
          dados.usuario.id_usuario,
        );
        const res = await api.get(
          `/aulas/dia?data=${hoje}&instrutorId=${dados.usuario.id_usuario}`,
        );

        console.log("Aulas carregadas para hoje:", res.data);

        setAula(selecionarAulaParaPresenca(res.data || []));
      } catch (err) {
        console.error("Erro ao buscar aulas:", err);
      }
    };

    carregarAulas();
  }, []);

  const iniciarPresenca = async () => {
    try {
      const dados = JSON.parse(sessionStorage.getItem("usuario"));
      if (!dados?.usuario) return;

      const hoje = getHojeIso();
      const res = await api.get(
        `/aulas/dia?data=${hoje}&instrutorId=${dados.usuario.id_usuario}`,
      );

      const aulaParaAbrir = selecionarAulaParaPresenca(res.data || []);

      if (!aulaParaAbrir?.aula?.id_turma || !aulaParaAbrir?.aula?.id_aula) {
        alert("Nenhuma aula em andamento encontrada para hoje.");
        return;
      }

      navigate(
        `/presenca/${aulaParaAbrir.aula.id_turma}/${aulaParaAbrir.aula.id_aula}`,
      );
    } catch (err) {
      console.error("Erro ao abrir a presença:", err);
      alert("Erro ao buscar a aula para marcar presença.");
    }
  };

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
                          alert(
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
