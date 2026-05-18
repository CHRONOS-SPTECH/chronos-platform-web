import { BookOpen, Plus } from "lucide-react";
import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/homeSecretario/Header";
import ModulosControle from "../../components/turmas/ModuloControle";
import CardTurma from "../../components/turmas/CardTurma";

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

export default function Turmas() {
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans antialiased">
      <Sidebar tipoUsuario="secretario" />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          titulo="Gestão Acadêmica"
          icone={BookOpen}
          usuario={{ nome: "Henrique", cargo: "Secretário" }}
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1500px] mx-auto p-8 flex flex-col gap-6">
            {/* Barra Superior de Navegação por Abas de Rota */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-6">
              <ModulosControle moduloAtivo="Turmas" />

              <button className="flex items-center gap-2 bg-[#1E7A3C] hover:bg-[#165a2d] text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-2xl transition-all shadow-md shadow-green-100/50 active:scale-[0.98]">
                <Plus size={16} />
                Nova Turma
              </button>
            </div>

            {/* Grid de Conteúdo das Turmas */}
            <div className="flex flex-col gap-5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                  Turmas Ativas e Concluídas
                </h2>
                <span className="text-xs font-bold text-slate-400">
                  {turmasMock.length} turmas listadas
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {turmasMock.map((turma) => (
                  <CardTurma key={turma.id} turma={turma} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
