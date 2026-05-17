import {
  ClipboardList,
  CalendarDays,
  Clock,
  GraduationCap,
} from "lucide-react";
import Header from "../../components/homeSecretario/Header";
import Sidebar from "../../components/sidebar/SideBar";
import CardPresenca from "../../components/presenca/CardPresenca";

function Presenca() {
  const alunos = [
    { nome: "Daniel Costa", presenca: 80, cpf: "123.456.789-00" },
    { nome: "Emilly Dos Reis", presenca: 95, cpf: "987.654.321-00" },
    { nome: "Nathalii Ribeiro", presenca: 60, cpf: "456.789.123-00" },
    { nome: "Matheus Zorzete", presenca: 100, cpf: "321.654.987-00" },
    { nome: "Fernando Fefe", presenca: 70, cpf: "789.123.456-00" },
    { nome: "Natalia Souza", presenca: 85, cpf: "654.321.987-00" },
  ];

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
          {/* BARRA DE CONTEXTO DA TURMA REESTRUTURADA */}
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
                    Turma
                  </span>
                  <span className="text-xs font-black text-slate-700 mt-0.5">
                    Ciclo I - Noturno
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
                    Janeiro / 2026
                  </span>
                </div>
              </div>

              <div className="hidden md:block w-px h-6 bg-slate-200"></div>

              {/* Previsão de Término */}
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                    Previsão de Término
                  </span>
                  <span className="text-xs font-bold text-slate-600 mt-0.5">
                    Setembro / 2026
                  </span>
                </div>
              </div>
            </div>

            {/* Lado Direito: Status / Ação Rápida */}
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Aula em Andamento
              </span>
            </div>
          </div>

          {/* LISTA DE ALUNOS */}
          <div className="p-8 flex-1">
            <CardPresenca alunos={alunos} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Presenca;
