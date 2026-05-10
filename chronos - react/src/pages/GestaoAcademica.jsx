import { useState } from "react";
import { BookOpen, Users, CalendarDays } from "lucide-react";
import Sidebar from "../components/sidebar/SideBar";
import Header from "../components/homeSecretario/Header";
import CardTurma from "../components/turmas/CardTurma";

const alunos = [
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
  { label: "Aluno", icone: <Users size={14} /> },
  { label: "Turmas", icone: <BookOpen size={14} /> },
  { label: "Eventos", icone: <CalendarDays size={14} /> },
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
          <div className="max-w-[1350px] mx-auto p-6 flex flex-col gap-5">
            {/* Tabs */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                  Módulos de Controle
                </p>

                <div className="flex gap-2 mt-1">
                  {TABS.map((tab) => (
                    <button
                      key={tab.label}
                      onClick={() => setAbaAtiva(tab.label)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${
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

              <button className="flex items-center gap-2 border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white font-bold px-4 py-2 rounded-xl text-[13px] transition-all">
                + Adicionar Turma
              </button>
            </div>

            {/* TURMAS */}
            {abaAtiva === "Turmas" && (
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-black text-gray-800 border-b-2 border-[#00871D] pb-2 w-fit">
                  Turmas
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {turmasMock.map((turma) => (
                    <CardTurma key={turma.id} turma={turma} />
                  ))}
                </div>
              </div>
            )}

            {/* ALUNOS */}
            {abaAtiva === "Aluno" && (
              <div className="flex flex-col gap-3">
                <h2 className="text-lg font-black text-gray-800 border-b-2 border-[#00871D] pb-2 w-fit">
                  Detalhes do Alunos
                </h2>

                <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-[#006400] text-left text-white">
                      <tr>
                        <th className="p-2 text-[10px] font-bold">
                          NOME/EMAIL
                        </th>

                        <th className="p-2 text-[10px] font-bold">
                          CPF
                        </th>

                        <th className="p-2 text-[10px] font-bold">
                          DATA NASC.
                        </th>

                        <th className="p-2 text-[10px] font-bold">
                          VÍNCULO
                        </th>

                        <th className="p-2 text-[10px] font-bold">
                          DATA MEMBRO
                        </th>

                        <th className="p-2 text-[10px] font-bold">
                          VOLUNTÁRIO?
                        </th>

                        <th className="p-2 text-[10px] font-bold">
                          AÇÕES
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {alunos.map((aluno, index) => (
                        <tr
                          key={index}
                          className="border-t border-gray-200 hover:bg-gray-50"
                        >
                          <td className="p-2">
                            <div className="flex flex-col">
                              <span className="font-bold text-[13px] text-gray-800">
                                {aluno.nome}
                              </span>

                              <span className="text-[10px] text-gray-500">
                                {aluno.email}
                              </span>
                            </div>
                          </td>

                          <td className="p-2 text-[12px] text-gray-700">
                            {aluno.cpf}
                          </td>

                          <td className="p-2 text-[12px] text-gray-700">
                            {aluno.dataNascimento}
                          </td>

                          <td className="p-2">
                            <span
                              className={`w-[105px] h-[24px] flex items-center justify-center rounded-md text-[10px] font-bold text-white ${
                                aluno.vinculo === "Membro"
                                  ? "bg-green-600"
                                  : "bg-orange-400"
                              }`}
                            >
                              {aluno.vinculo}
                            </span>
                          </td>

                          <td className="p-2 text-[12px] text-gray-700">
                            {aluno.dataMembro}
                          </td>

                          <td className="p-2">
                            <div
                              className={`w-4 h-4 rounded-full border ${
                                aluno.voluntario
                                  ? "bg-green-500 border-green-500"
                                  : "bg-gray-300 border-gray-300"
                              }`}
                            />
                          </td>

                          <td className="p-2">
                            <div className="flex gap-1">
                              <button className="border border-gray-300 px-1.5 py-1 rounded hover:bg-gray-100 text-[11px]">
                                👁
                              </button>

                              <button className="border border-gray-300 px-1.5 py-1 rounded hover:bg-gray-100 text-[11px]">
                                ✏️
                              </button>

                              <button className="border border-gray-300 px-1.5 py-1 rounded hover:bg-gray-100 text-[11px]">
                                🗑
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* EVENTOS */}
            {abaAtiva === "Eventos" && (
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-black text-gray-800 border-b-2 border-[#00871D] pb-2 w-fit">
                  Eventos
                </h2>

                <p className="text-gray-400 text-sm">
                  Em desenvolvimento...
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default GestaoAcademica;