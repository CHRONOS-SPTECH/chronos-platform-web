import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Captura o ID da URL
import {
  ClipboardList,
  CalendarDays,
  Clock,
  GraduationCap,
} from "lucide-react";
import Header from "../../components/homeSecretario/Header";
import Sidebar from "../../components/sidebar/SideBar";
import CardPresenca from "../../components/presenca/CardPresenca";
import api from "../../services/api";

function Presenca() {
  const { idAula } = useParams();

  const [dadosAula, setDadosAula] = useState(null);
  const [alunos, setAlunos] = useState([]);

  useEffect(() => {
    const fetchDadosAula = async () => {
      try {
        // 1. Pega os dados do instrutor no sessionStorage
        const usuarioStorage = sessionStorage.getItem("usuario");
        if (!usuarioStorage) return;
        const usuarioObj = JSON.parse(usuarioStorage);
        const instrutorId = usuarioObj.id_usuario;

        // 2. Data da requisição (pode ser dinâmica ou fixa conforme seu padrão)
        const dataRequisicao = "2026-05-22";

        // 3. Busca a lista de todas as aulas do dia
        const response = await api.get(
          `/aulas/dia?data=${dataRequisicao}&instrutorId=${instrutorId}`,
        );

        // 4. Encontra a aula específica clicada pelo ID da URL
        const aulaSelecionada = response.data.find(
          (aula) => String(aula.id_aula) === String(idAula),
        );

        if (aulaSelecionada) {
          setDadosAula(aulaSelecionada);

          setAlunos(aulaSelecionada.alunos || []);
        } else {
          console.error("Aula não encontrada no cronograma.");
        }
      } catch (error) {
        console.error("Erro ao carregar dados da presença:", error);
      }
    };

    if (idAula) {
      fetchDadosAula();
    }
  }, [idAula]);

  // Funções auxiliares para tratar a exibição dos dados vindos do seu banco
  const formatarHorario = () => {
    if (!dadosAula) return "00:00 - 00:00";
    const inicio = dadosAula.hora_inicio.slice(0, 5);
    const fim = dadosAula.hora_fim.slice(0, 5);
    return `${inicio}h - ${fim}h`;
  };

  const formatarDataMesAno = (dataIso) => {
    if (!dataIso) return "";
    const data = new Date(dataIso);
    return data.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      <Sidebar tipoUsuario="instrutor" />

      {/* Painel Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          titulo="Registro de Presença"
          icone={ClipboardList}
          usuario={{ nome: "Henrique", cargo: "Instrutor" }}
        />

        <main className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
          {/* BARRA DE CONTEXTO DA TURMA REESTRUTURADA COM DADOS DA API */}
          <div className="px-8 py-5 border-b border-slate-100 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300">
            {/* Lado Esquerdo: Detalhes da Turma */}
            <div className="flex flex-wrap items-center gap-6">
              {/* Badge da Disciplina/Turma */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl">
                <div className="p-1.5 bg-green-50 text-[#1E7A3C] rounded-lg">
                  <GraduationCap size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                    Turma / Matéria
                  </span>
                  <span className="text-xs font-black text-slate-700 mt-0.5">
                    {dadosAula?.turma?.nome_turma || "Sem Turma"} -{" "}
                    {dadosAula?.nome_aula}
                  </span>
                </div>
              </div>

              {/* Data de Início da Turma */}
              <div className="flex items-center gap-3">
                <CalendarDays size={18} className="text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                    Iniciada em
                  </span>
                  <span className="text-xs font-bold text-slate-600 mt-0.5">
                    {formatarDataMesAno(dadosAula?.turma?.data_inicio) ||
                      "Janeiro / 2026"}
                  </span>
                </div>
              </div>

              <div className="hidden md:block w-px h-6 bg-slate-200"></div>

              {/* Horário Real da Aula */}
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                    Horário da Aula
                  </span>
                  <span className="text-xs font-bold text-slate-600 mt-0.5">
                    {formatarHorario()}
                  </span>
                </div>
              </div>
            </div>

            {/* Lado Direito: Status / Ação Rápida */}
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {dadosAula?.statusAula || "Aula em Andamento"}
              </span>
            </div>
          </div>

          {/* LISTA DE ALUNOS - Passando a lista real filtrada */}
          <div className="p-8 flex-1">
            {alunos.length === 0 ? (
              <div className="text-center py-12 text-sm text-slate-400 font-medium bg-white rounded-2xl border border-slate-100 shadow-sm">
                Nenhum aluno matriculado nesta turma para o dia de hoje.
              </div>
            ) : (
              <CardPresenca alunos={alunos} dadosAula={dadosAula} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Presenca;
