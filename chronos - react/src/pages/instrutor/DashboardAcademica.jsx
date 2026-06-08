import { Home } from "lucide-react";
import { Users, Info } from "@phosphor-icons/react";

import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/homeSecretario/Header";

import AgeChart from "../../components/Charts/AgeChart";
import StudentsChart from "../../components/Charts/StudentsChart";

function DashboardAcademica() {
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header titulo="Dashboard Acadêmica" icone={Home} />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-400 mx-auto p-6 flex flex-col gap-5">
            {/* ========================= */}
            {/* CARDS SUPERIORES */}
            {/* ========================= */}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {/* COMUNIDADE */}
              <div className="bg-white rounded-2xl shadow border-l-4 border-green-600 p-5">
                <h3 className="text-xs font-black uppercase text-slate-500">
                  Comunidade Acadêmica
                </h3>

                <div className="flex items-end gap-2 mt-3">
                  <span className="text-5xl font-black">1.042</span>

                  <span className="text-slate-500 text-lg mb-1">Pessoas</span>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                    <span>504</span>
                    <span>300</span>
                    <span>200</span>
                  </div>

                  <div className="flex h-2 rounded-full overflow-hidden">
                    <div className="bg-green-800 w-[48%]" />
                    <div className="bg-green-500 w-[30%]" />
                    <div className="bg-green-300 w-[22%]" />
                  </div>

                  <div className="flex justify-between mt-2 text-[10px] text-slate-500">
                    <span>Membros</span>
                    <span>Provacionistas</span>
                    <span>Público Externo</span>
                  </div>
                </div>
              </div>

              {/* PEDAGÓGICO */}
              <div className="bg-white rounded-2xl shadow border-l-4 border-green-600 p-5">
                <h3 className="text-xs font-black uppercase text-slate-500">
                  Capacidade Pedagógica
                </h3>

                <div className="flex items-center gap-4 mt-5">
                  <div className="flex -space-x-2">
                    <div className="w-12 h-12 rounded-full bg-green-700 text-white flex items-center justify-center font-bold border-2 border-white">
                      L
                    </div>

                    <div className="w-12 h-12 rounded-full bg-green-200 border-2 border-white" />
                  </div>

                  <div>
                    <h1 className="text-4xl font-black">18</h1>

                    <p className="text-slate-500">Instrutores</p>
                  </div>
                </div>
              </div>

              {/* ENGAJAMENTO */}
              <div className="bg-green-700 text-white rounded-2xl shadow p-5">
                <h3 className="text-xs font-black uppercase">
                  Engajamento Voluntário
                </h3>

                <div className="flex justify-between items-end mt-4">
                  <div>
                    <h1 className="text-5xl font-black">501</h1>

                    <p>Membros Ativos</p>
                  </div>

                  <div className="text-right">
                    <h1 className="text-4xl font-black">78%</h1>

                    <p className="text-xs opacity-70">do quadro de membros</p>
                  </div>
                </div>

                <div className="mt-4 h-2 rounded-full bg-green-900 overflow-hidden">
                  <div className="h-full w-[78%] bg-white rounded-full" />
                </div>
              </div>
            </div>

            {/* ========================= */}
            {/* ÁREA INFERIOR */}
            {/* ========================= */}

            <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-4">
              {/* ESQUERDA */}

              <div className="bg-white rounded-2xl shadow p-4">
                <div className="border border-green-300 rounded-xl p-4">
                  <h3 className="text-xs font-black uppercase text-green-700">
                    Resumo Turmas
                  </h3>

                  <div className="mt-4 flex justify-between">
                    <span>Em andamento</span>

                    <span className="font-bold text-green-700">12</span>
                  </div>

                  <div className="mt-2 flex justify-between">
                    <span>Não iniciadas</span>

                    <span className="font-bold">04</span>
                  </div>
                </div>

                <div className="border-t mt-5 pt-5">
                  <h3 className="text-xs text-center font-black uppercase text-green-700 mb-3">
                    Alunos por Nível
                  </h3>

                  <div className="h-[260px]">
                    <StudentsChart />
                  </div>
                </div>
              </div>

              {/* DIREITA */}

              <div className="bg-white rounded-2xl shadow overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr]">
                  {/* INCLUSÃO */}

                  <div className="p-5 border-r border-slate-200 flex flex-col">
                    <h2 className="text-2xl font-black">INCLUSÃO</h2>

                    <p className="text-xs text-slate-400 mt-1">
                      Distribuição por gênero
                    </p>

                    <div className="mt-8 space-y-8">
                      {[
                        {
                          total: 562,
                          nome: "Mulheres",
                          perc: "54%",
                          cor: "bg-green-100 text-green-700",
                        },
                        {
                          total: 468,
                          nome: "Homens",
                          perc: "45%",
                          cor: "bg-slate-100 text-slate-600",
                        },
                        {
                          total: 12,
                          nome: "Outros",
                          perc: "1%",
                          cor: "bg-cyan-100 text-cyan-700",
                        },
                      ].map((item) => (
                        <div
                          key={item.nome}
                          className="flex items-center gap-4"
                        >
                          <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center ${item.cor}`}
                          >
                            <Users size={18} />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h1 className="text-4xl font-black">
                                {item.total}
                              </h1>

                              <span
                                className={`px-2 py-1 rounded-full text-[10px] font-bold ${item.cor}`}
                              >
                                {item.perc}
                              </span>
                            </div>

                            <p className="uppercase text-xs text-slate-400 font-bold">
                              {item.nome}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto border-t pt-5">
                      <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-lg bg-green-600 text-white flex items-center justify-center">
                          <Info size={16} />
                        </div>

                        <div>
                          <h4 className="font-black text-xs uppercase">
                            Equilíbrio de Gênero
                          </h4>

                          <p className="text-[11px] text-slate-500 mt-1">
                            A base apresenta predominância feminina de 54%.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FAIXAS */}

                  <div className="p-5 flex flex-col">
                    <h2 className="text-2xl font-black">FAIXAS ETÁRIAS</h2>

                    <p className="text-xs text-slate-400 uppercase mt-1">
                      Volume de pessoas por idade e gênero
                    </p>

                    <div className="flex-1 min-h-[340px] mt-4">
                      <AgeChart />
                    </div>

                    <div className="grid grid-cols-3 gap-3 border-t pt-4">
                      <div className="bg-slate-50 rounded-xl p-4">
                        <h3 className="text-4xl font-black text-green-700">
                          25-34
                        </h3>

                        <p className="text-[10px] uppercase text-slate-400 font-bold">
                          Idade mais comum
                        </p>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-4">
                        <h3 className="text-4xl font-black">38</h3>

                        <p className="text-[10px] uppercase text-slate-400 font-bold">
                          Média de anos
                        </p>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-4">
                        <h3 className="text-4xl font-black">85</h3>

                        <p className="text-[10px] uppercase text-slate-400 font-bold">
                          Pessoas 65+
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardAcademica;
