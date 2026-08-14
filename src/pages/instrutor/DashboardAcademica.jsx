import { Home } from "lucide-react";
import { Users, Info } from "@phosphor-icons/react";

import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/homeSecretario/Header";
import AgeChart from "../../components/Charts/AgeChart";
import useDashboardAcademica from "../../hooks/useDashboardAcademica";

function DashboardAcademica() {
  const {
    resumo,
    dadosGenero,
    dadosFaixaEtaria,
    carregando,
    totalPessoas,
    membros,
    provacionistas,
    externos,
    ativos,
    indicadores,
    generoDistribuicao,
    obterEstiloPorGenero,
  } = useDashboardAcademica();

  if (carregando) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  const membrosPerc = indicadores.membrosPercentual;
  const provacPerc = indicadores.provacionistasPercentual;
  const externoPerc = indicadores.externosPercentual;
  const ativoComunidadePerc = indicadores.engajamentoPercentual;

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header titulo="Dashboard Acadêmica" icone={Home} />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1400px] mx-auto p-6 flex flex-col gap-5">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl shadow-sm border-l-4 border-green-600 p-4 flex flex-col justify-between min-h-[135px]">
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Comunidade Acadêmica
                  </h3>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-4xl font-black text-slate-800 tracking-tight">
                      {totalPessoas.toLocaleString("pt-BR")}
                    </span>
                    <span className="text-slate-400 font-medium text-xs">
                      Pessoas
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-[11px] font-extrabold text-slate-600 mb-1 px-0.5">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-800" />
                      {membros}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {provacionistas}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-300" />
                      {externos}
                    </span>
                  </div>

                  <div className="flex h-2 rounded-full overflow-hidden bg-slate-100">
                    <div
                      className="bg-green-800 h-full transition-all duration-500"
                      style={{ width: `${membrosPerc}%` }}
                    />
                    <div
                      className="bg-green-500 h-full transition-all duration-500"
                      style={{ width: `${provacPerc}%` }}
                    />
                    <div
                      className="bg-green-300 h-full transition-all duration-500"
                      style={{ width: `${externoPerc}%` }}
                    />
                  </div>

                  <div className="flex justify-between mt-1 text-[9px] text-slate-400 font-semibold uppercase tracking-wider px-0.5">
                    <span>Membros</span>
                    <span>Provac.</span>
                    <span>Externo</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border-l-4 border-green-600 p-4 flex items-center justify-between min-h-[135px]">
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Capacidade Pedagógica
                  </h3>
                  <div className="mt-1">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                      {resumo?.capacidade_pedagogica?.total_instrutores || 0}
                    </h1>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                      Instrutores
                    </p>
                  </div>
                </div>
                <div className="flex -space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center font-black text-base shadow-sm border-2 border-white">
                    C
                  </div>
                  <div className="w-10 h-10 rounded-full bg-green-200 border-2 border-white shadow-sm" />
                </div>
              </div>

              <div className="bg-green-700 text-white rounded-2xl shadow-sm p-4 flex flex-col justify-between min-h-[135px]">
                <h3 className="text-[11px] font-black uppercase tracking-wider opacity-90">
                  Engajamento Voluntário
                </h3>

                <div className="flex justify-between items-end mt-2">
                  <div>
                    <h1 className="text-4xl font-black tracking-tight">
                      {ativos}
                    </h1>
                    <p className="text-xs opacity-90 font-medium">
                      Membros Ativos
                    </p>
                  </div>

                  <div className="text-right">
                    <h1 className="text-3xl font-black tracking-tight text-green-200">
                      {ativoComunidadePerc}%
                    </h1>
                    <p className="text-[9px] opacity-75 font-semibold uppercase tracking-wider">
                      Da Comunidade
                    </p>
                  </div>
                </div>

                <div className="mt-2 h-1.5 rounded-full bg-green-900 overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-500"
                    style={{ width: `${ativoComunidadePerc}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr]">
                <div className="p-5 border-b xl:border-b-0 xl:border-r border-slate-100 flex flex-col bg-slate-50/30 justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">
                      INCLUSÃO
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      Distribuição por gênero
                    </p>
                  </div>

                  <div className="my-6 space-y-4 flex-1 flex flex-col justify-center">
                    {generoDistribuicao.map((item) => {
                      const estiloCor = obterEstiloPorGenero(item.genero);
                      return (
                        <div
                          key={item.genero}
                          className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center border ${estiloCor}`}
                            >
                              <Users size={18} weight="bold" />
                            </div>
                            <div>
                              <p className="uppercase text-[10px] text-slate-400 font-extrabold tracking-wider">
                                {item.genero}
                              </p>
                              <h1 className="text-xl font-black text-slate-800 leading-none mt-0.5">
                                {item.total}
                              </h1>
                            </div>
                          </div>

                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${estiloCor}`}
                          >
                            {item.percentual}%
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex gap-2.5 items-start p-3 bg-white rounded-xl border border-slate-100">
                      <div className="w-7 h-7 rounded-lg bg-green-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                        <Info size={14} weight="bold" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[11px] text-slate-700 uppercase tracking-wide">
                          Equilíbrio de Gênero
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-tight">
                          {dadosGenero?.equilibrio_genero?.nota ||
                            "Dados indisponíveis."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">
                      FAIXAS ETÁRIAS
                    </h2>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                      Volume de pessoas por idade e gênero
                    </p>
                  </div>

                  <div className="flex-1 min-h-[300px] mt-4 mb-4">
                    <AgeChart data={dadosFaixaEtaria?.faixas || []} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-4">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                      <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">
                        Idade mais comum
                      </p>
                      <h3 className="text-2xl font-black text-green-700 tracking-tight mt-0.5">
                        {dadosFaixaEtaria?.resumo?.idade_mais_comum || "N/A"}
                      </h3>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                      <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">
                        Média de anos
                      </p>
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-0.5">
                        {dadosFaixaEtaria?.resumo?.media_anos || 0}{" "}
                        <span className="text-xs text-slate-400 font-normal">
                          anos
                        </span>
                      </h3>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                      <p className="text-[9px] uppercase text-slate-400 font-bold tracking-wider">
                        Pessoas 65+
                      </p>
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-0.5">
                        {dadosFaixaEtaria?.resumo?.total_acima_65 || 0}
                      </h3>
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
