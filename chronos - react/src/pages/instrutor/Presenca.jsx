import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  const { idAula: idDaAulaURL } = useParams();

  // Estados com nomes diretos e amigáveis
  const [informacoesAula, setInformacoesAula] = useState(null);
  const [listaAlunos, setListaAlunos] = useState([]);

  // Esse efeito roda assim que a página abre para buscar os dados na API
  useEffect(() => {
    const buscarDadosDoBanco = async () => {
      try {
        const dadosUsuarioBruto = sessionStorage.getItem("usuario");
        if (!dadosUsuarioBruto) return;

        const usuarioObjeto = JSON.parse(dadosUsuarioBruto);
        const idInstrutor = usuarioObjeto.id_usuario;

        // 2. Definimos a data do dia que queremos buscar as aulas
        const dataDeHoje = "2026-05-22";

        const resposta = await api.get(
          `/aulas/dia?data=${dataDeHoje}&instrutorId=${idInstrutor}`,
        );
        const listaDeAulas = resposta.data;

        const aulaEncontrada = listaDeAulas.find(
          (aula) => aula.id_aula == idDaAulaURL,
        );

        if (aulaEncontrada) {
          setInformacoesAula(aulaEncontrada);
          setListaAlunos(aulaEncontrada.alunos || []);
        } else {
          console.error("Não encontramos essa aula no cronograma do dia.");
        }
      } catch (erro) {
        console.error(
          "Tivemos um problema ao carregar os dados da presença:",
          erro,
        );
      }
    };

    if (idDaAulaURL) {
      buscarDadosDoBanco();
    }
  }, [idDaAulaURL]);

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* MENU LATERAL */}
      <Sidebar tipoUsuario="instrutor" />

      {/* PAINEL PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOPO DA PÁGINA */}
        <Header
          titulo="Registro de Presença"
          icone={ClipboardList}
          usuario={{ nome: "Henrique", cargo: "Instrutor" }}
        />

        <main className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
          {/* BARRA DE DETALHES DA TURMA */}
          <div className="px-8 py-5 border-b border-slate-100 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex flex-wrap items-center gap-6">
              {/* Nome da Turma e da Matéria */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl">
                <div className="p-1.5 bg-green-50 text-[#1E7A3C] rounded-lg">
                  <GraduationCap size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                    Turma / Matéria
                  </span>
                  <span className="text-xs font-black text-slate-700 mt-0.5">
                    {informacoesAula?.turma?.nome_turma || "Sem Turma"} -{" "}
                    {informacoesAula?.nome_aula}
                  </span>
                </div>
              </div>

              {/* Data que a turma começou */}
              <div className="flex items-center gap-3">
                <CalendarDays size={18} className="text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                    Iniciada em
                  </span>
                  <span className="text-xs font-bold text-slate-600 mt-0.5">
                    {informacoesAula?.turma?.data_inicio
                      ? new Date(
                          informacoesAula.turma.data_inicio,
                        ).toLocaleDateString("pt-BR", {
                          month: "long",
                          year: "numeric",
                        })
                      : "Maio / 2026"}
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
                    {informacoesAula
                      ? `${informacoesAula.hora_inicio.slice(0, 5)}h - ${informacoesAula.hora_fim.slice(0, 5)}h`
                      : "00:00 - 00:00"}
                  </span>
                </div>
              </div>
            </div>

            {/* Status da Aula */}
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {informacoesAula?.statusAula || "Aula em Andamento"}
              </span>
            </div>
          </div>

          {/* ÁREA CENTRAL - LISTA DE ALUNOS */}
          <div className="p-8 flex-1">
            {listaAlunos.length === 0 ? (
              <div className="text-center py-12 text-sm text-slate-400 font-medium bg-white rounded-2xl border border-slate-100 shadow-sm">
                Nenhum aluno matriculado nesta turma para o dia de hoje.
              </div>
            ) : (
              <CardPresenca alunos={listaAlunos} dadosAula={informacoesAula} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Presenca;
