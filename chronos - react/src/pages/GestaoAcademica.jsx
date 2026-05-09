import { useState } from "react";
import { BookOpen, Users, CalendarDays } from "lucide-react";
import Sidebar from "../components/sidebar/SideBar";
import Header from "../components/homeSecretario/Header";
import CardTurma from "../components/turmas/CardTurma";

const turmasMock = [
  {
    id: 1,
    nome: "Filosofia para Viver - T3",
    status: "Em Andamento",
    dataInicio: "20/01/2026",
    dataFim: "20/01/2027",
    progresso: 38,
  },
  {
    id: 2,
    nome: "Filosofia para Viver - T2",
    status: "Em Andamento",
    dataInicio: "31/05/2025",
    dataFim: "20/05/2026",
    progresso: 65,
  },
  {
    id: 3,
    nome: "Filosofia para Viver - T1",
    status: "Formado",
    dataInicio: "12/01/2025",
    dataFim: "20/12/2025",
    progresso: 100,
  },
];

const TABS = [
  { label: "Aluno", icone: <Users size={15} /> },
  { label: "Turmas", icone: <BookOpen size={15} /> },
  { label: "Eventos", icone: <CalendarDays size={15} /> },
];

function GestaoAcademica() {
  const [abaAtiva, setAbaAtiva] = useState("Turmas");

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      <Sidebar
        tipoUsuario="secretario"
        usuario={{ inicial: "H", nome: "Henrique" }}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header titulo="Gestão Acadêmica" icone={BookOpen} />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1400px] mx-auto p-8 flex flex-col gap-6">
            {/* Controles: tabs + botão */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">
                  Módulos de Controle
                </p>
                <div className="flex gap-2 mt-1">
                  {TABS.map((tab) => (
                    <button
                      key={tab.label}
                      onClick={() => setAbaAtiva(tab.label)}
                      className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                        abaAtiva === tab.label
                          ? "bg-[#00871D] text-white shadow-md"
                          : "bg-white text-gray-500 border border-gray-200 hover:border-[#00871D]/30 hover:text-[#00871D]"
                      }`}
                    >
                      {tab.icone}
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <button className="flex items-center gap-2 border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all">
                + Adicionar Turma
              </button>
            </div>

            {/* Conteúdo da aba ativa */}
            {abaAtiva === "Turmas" && (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-black text-gray-800 border-b-2 border-[#00871D] pb-2 w-fit">
                  Turmas
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {turmasMock.map((turma) => (
                    <CardTurma key={turma.id} turma={turma} />
                  ))}
                </div>
              </div>
            )}

            {abaAtiva === "Aluno" && (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-black text-gray-800 border-b-2 border-[#00871D] pb-2 w-fit">
                  Alunos
                </h2>
                <p className="text-gray-400 text-sm">Em desenvolvimento...</p>
              </div>
            )}

            {abaAtiva === "Eventos" && (
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-black text-gray-800 border-b-2 border-[#00871D] pb-2 w-fit">
                  Eventos
                </h2>
                <p className="text-gray-400 text-sm">Em desenvolvimento...</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default GestaoAcademica;
