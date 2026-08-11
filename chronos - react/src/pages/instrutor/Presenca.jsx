import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  CalendarDays,
  Clock,
  GraduationCap,
  ArrowLeft,
} from "lucide-react";
import Header from "../../components/homeSecretario/Header";
import Sidebar from "../../components/sidebar/SideBar";
import CardPresenca from "../../components/presenca/CardPresenca";
import api from "../../services/api";
import sessionService from "../../services/sessionService";

function Presenca() {
  const { idTurma, idAula } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [turma, setTurma] = useState(null);
  const [aula, setAula] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Carrega todas as informações necessárias da presença
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);

        const dadosSessao = sessionService.getSession();
        if (dadosSessao) setUsuario(dadosSessao);

        const [resTurma, resAula, resAlunos, resChamadas] = await Promise.all([
          api.get(`/turmas/${idTurma}`),
          api.get(`/aulas/${idAula}/detalhada`),
          api.get(`/turmas/${idTurma}/alunos`),
          api.get(`/chamadas-aula/aula/${idAula}`),
        ]);

        const turmaData = resTurma.data;
        const aulaData = resAula.data;
        const alunosData = resAlunos.data || [];
        const presencasData = resChamadas.data || [];

        const alunosComPresenca = (alunosData || []).map((aluno) => {
          const registro = (presencasData || []).find(
            (item) => Number(item.id_pessoa) === Number(aluno.id_pessoa),
          );

          return {
            ...aluno,
            presente: Boolean(registro?.compareceu),
            compareceu: Boolean(registro?.compareceu),
          };
        });

        setTurma(turmaData);
        setAula(aulaData);
        setAlunos(alunosComPresenca);
      } catch (err) {
        console.error("Erro ao carregar dados da presença:", err);
      } finally {
        setCarregando(false);
      }
    };

    if (idTurma && idAula) carregarDados();
  }, [idTurma, idAula]);

  if (carregando) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#1E7A3C] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          titulo="Registro de Presença"
          icone={ClipboardList}
          usuario={{ nome: usuario?.nome || "Instrutor", cargo: "Instrutor" }}
        />

        <main className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
          {/* Ações de Navegação */}
          <div className="px-8 pt-4">
            <button
              onClick={() => navigate("/instrutor")}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 transition-colors group"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
              Voltar para o Início
            </button>
          </div>

          {/* Barra de Resumo do Contexto da Aula */}
          <div className="px-8 py-5 border-b border-slate-100 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300 mt-2">
            <div className="flex flex-wrap items-center gap-6">
              {/* Turma e Matéria */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl">
                <div className="p-1.5 bg-green-50 text-[#1E7A3C] rounded-lg">
                  <GraduationCap size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                    Turma / Matéria
                  </span>
                  <span className="text-xs font-black text-slate-700 mt-0.5">
                    {turma?.nome_turma || "Sem Turma"} -{" "}
                    {aula?.materia?.nome || "Sem Matéria"}
                  </span>
                </div>
              </div>

              {/* Data de Início */}
              <div className="flex items-center gap-3">
                <CalendarDays size={18} className="text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                    Iniciada em
                  </span>
                  <span className="text-xs font-bold text-slate-600 mt-0.5">
                    {turma?.data_inicio
                      ? new Date(turma.data_inicio).toLocaleDateString(
                          "pt-BR",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          },
                        )
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div className="hidden md:block w-px h-6 bg-slate-200"></div>

              {/* Horário da Aula */}
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                    Horário da Aula
                  </span>
                  <span className="text-xs font-bold text-slate-600 mt-0.5">
                    {aula?.aula
                      ? `${aula.aula.hora_inicio.slice(0, 5)}h - ${aula.aula.hora_fim.slice(0, 5)}h`
                      : "00:00 - 00:00"}
                  </span>
                </div>
              </div>
            </div>

            {/* Status do Registro */}
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>

                {aula?.chamadaFeita ? "Concluída" : aula?.aula?.statusAula}
              </span>
            </div>
          </div>

          {/* Listagem de Alunos / Formulário de Chamada */}
          <div className="p-8 flex-1">
            {alunos.length === 0 ? (
              <div className="text-center py-12 text-sm text-slate-400 font-medium bg-white rounded-2xl border border-slate-100 shadow-sm">
                Nenhum aluno matriculado nesta turma.
              </div>
            ) : (
              <CardPresenca alunos={alunos} dadosAula={aula} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Presenca;
