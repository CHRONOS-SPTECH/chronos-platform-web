import { BookOpen, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/homeSecretario/Header";
import ModulosControle from "../../components/turmas/ModuloControle";

const alunosMock = [
  {
    nome: "Daniel Costa Avelino",
    email: "danielcosta3448@gmail.com",
    cpf: "123.456.789-07",
    dataNascimento: "12/02/2006",
    vinculo: "Membro",
    dataMembro: "20/01/2026",
    voluntario: true,
  },
  {
    nome: "Nathally Ribeiro",
    email: "nathally@gmail.com",
    cpf: "123.456.789-07",
    dataNascimento: "31/01/2006",
    vinculo: "Membro",
    dataMembro: "20/01/2026",
    voluntario: true,
  },
  {
    nome: "Emilly Bastos Reis",
    email: "emillybastos34@gmail.com",
    cpf: "123.456.789-07",
    dataNascimento: "20/12/2006",
    vinculo: "Membro",
    dataMembro: "20/01/2026",
    voluntario: true,
  },
  {
    nome: "Natalia Lucas Pires",
    email: "natalialucas@gmail.com",
    cpf: "123.456.789-07",
    dataNascimento: "29/07/2006",
    vinculo: "Membro",
    dataMembro: "20/01/2026",
    voluntario: true,
  },
  {
    nome: "Mateus Zozo",
    email: "mateuszozo245@gmail.com",
    cpf: "123.456.789-07",
    dataNascimento: "17/05/2006",
    vinculo: "Provacionista",
    dataMembro: "20/01/2026",
    voluntario: false,
  },
  {
    nome: "Fernando Lopes Alpe",
    email: "lopesfernando@gmail.com",
    cpf: "123.456.789-07",
    dataNascimento: "25/10/2006",
    vinculo: "Provacionista",
    dataMembro: "20/01/2026",
    voluntario: false,
  },
];

const BADGE_VINCOLO = {
  Membro: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Provacionista: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function Alunos() {
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
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-6">
              <ModulosControle moduloAtivo="Alunos" />

              <button className="flex items-center gap-2 bg-[#1E7A3C] hover:bg-[#165a2d] text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-2xl transition-all shadow-md shadow-green-100/50 active:scale-[0.98]">
                <Plus size={16} />
                Novo Aluno
              </button>
            </div>

            {/* Quadro Geral de Alunos */}
            <div className="flex flex-col gap-5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                  Quadro Geral de Alunos
                </h2>
                <span className="text-xs font-bold text-slate-400">
                  {alunosMock.length} alunos cadastrados
                </span>
              </div>

              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden max-h-[380px] overflow-y-auto custom-scrollbar relative">
                <table className="w-full border-collapse text-left table-fixed sm:table-auto">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="sticky top-0 z-10 p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/90 backdrop-blur-sm">
                        Nome / Email
                      </th>
                      <th className="sticky top-0 z-10 p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/90 backdrop-blur-sm">
                        CPF
                      </th>
                      <th className="sticky top-0 z-10 p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/90 backdrop-blur-sm">
                        Nascimento
                      </th>
                      <th className="sticky top-0 z-10 p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/90 backdrop-blur-sm">
                        Vínculo
                      </th>
                      <th className="sticky top-0 z-10 p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/90 backdrop-blur-sm">
                        Data Admissão
                      </th>
                      <th className="sticky top-0 z-10 p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center bg-slate-50/90 backdrop-blur-sm">
                        Voluntário
                      </th>
                      <th className="sticky top-0 z-10 p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right bg-slate-50/90 backdrop-blur-sm">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {alunosMock.map((aluno, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-slate-800 group-hover:text-[#1E7A3C] transition-colors">
                              {aluno.nome}
                            </span>
                            <span className="text-xs text-slate-400 font-medium mt-0.5">
                              {aluno.email}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-xs font-semibold text-slate-600">
                          {aluno.cpf}
                        </td>
                        <td className="p-4 text-xs font-semibold text-slate-600">
                          {aluno.dataNascimento}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${BADGE_VINCOLO[aluno.vinculo]}`}
                          >
                            {aluno.vinculo}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-semibold text-slate-600">
                          {aluno.dataMembro}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center">
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${aluno.voluntario ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-slate-300"}`}
                            />
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1.5 justify-end">
                            <button className="p-2 border border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all shadow-sm">
                              <Eye size={14} />
                            </button>
                            <button className="p-2 border border-slate-100 text-slate-400 hover:text-[#1E7A3C] hover:bg-green-50/50 rounded-xl transition-all shadow-sm">
                              <Pencil size={14} />
                            </button>
                            <button className="p-2 border border-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50/50 rounded-xl transition-all shadow-sm">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
