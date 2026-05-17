import Header from "../components/homeSecretario/Header";
import Sidebar from "../components/sidebar/SideBar";
import Profile from "../components/homeSecretario/Profile";
import Acoes from "../components/homeSecretario/Acoes";
import Evento from "../components/homeSecretario/Evento";
import { Home, LayoutGrid, Users, UserSearch } from "lucide-react";

const vitalidade = {
  stats: [
    { label: "Frequência Geral", valor: "92%", cor: "text-blue-600" },
    { label: "Aulas Realizadas", valor: "45 / 48", cor: "text-green-600" },
    { label: "Taxa de Aprovação", valor: "87%", cor: "text-purple-600" },
  ],
  statusAluno: [
    { label: "Total Ativos", valor: 320, estilo: "text-gray-800" },
    { label: "Em riscos (Faltas)", valor: 12, estilo: "text-red-500 bg-red-50", destaque: true },
    { label: "Novas Matrículas", valor: "+15", estilo: "text-green-600 bg-green-50", destaque: true },
  ],
  pedagogico: [
    { label: "Oficinas (Oficial)", valor: 3 },
    { label: "Eventos (Oficial)", valor: 2 },
    { label: "Eventos/Oficinas Realizadas", valor: 5 },
  ],
};

function HomeDiretor() {
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      <Sidebar
        tipoUsuario="Administrador"
        usuario={{ inicial: "H", nome: "Henrique" }}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header titulo="Home" icone={Home} />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1600px] mx-auto p-8 flex flex-col gap-8">
            {/* Perfil */}
            <section className="animate-in fade-in duration-500">
              <Profile nome="Henrique" cargo="Administrador" />
            </section>

            <div className="flex flex-col xl:flex-row gap-8 items-start">
              {/* Coluna Esquerda */}
              <div className="flex-1 flex flex-col gap-8 min-w-0 w-full">
                {/* Ações */}
                <Acoes
                  titulo="MINHAS AÇÕES"
                  acaoPrincipal={{
                    texto: "Dashboard Completa",
                    icone: <LayoutGrid size={24} />,
                  }}
                  acoesSecundarias={[
                    { texto: "Gerenciar Usuários", icone: <Users size={20} /> },
                    { texto: "Consultar Alunos", icone: <UserSearch size={20} /> },
                  ]}
                />

                {/* Vitalidade Acadêmica */}
                <div className="flex flex-col gap-4">
                  <p className="font-bold text-[#00000084]">VITALIDADE ACADÊMICA</p>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Stats */}
                    <div className="flex divide-x divide-gray-100 border-b border-gray-100">
                      {vitalidade.stats.map((stat, i) => (
                        <div key={i} className="flex-1 p-5 flex flex-col items-center gap-1">
                          <span className={`text-2xl font-black ${stat.cor}`}>{stat.valor}</span>
                          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider text-center">{stat.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tabelas */}
                    <div className="flex divide-x divide-gray-100">
                      {/* Status do Aluno */}
                      <div className="flex-1 p-5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Status do Aluno</p>
                        <table className="w-full">
                          <tbody>
                            {vitalidade.statusAluno.map((item, i) => (
                              <tr key={i} className="border-b border-gray-50 last:border-0">
                                <td className="py-2 text-[12px] text-gray-600">{item.label}</td>
                                <td className="py-2 text-right">
                                  {item.destaque ? (
                                    <span className={`text-[12px] font-bold px-2 py-0.5 rounded ${item.estilo}`}>{item.valor}</span>
                                  ) : (
                                    <span className="text-[12px] font-bold text-gray-800">{item.valor}</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pedagógico */}
                      <div className="flex-1 p-5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Pedagógico</p>
                        <table className="w-full">
                          <tbody>
                            {vitalidade.pedagogico.map((item, i) => (
                              <tr key={i} className="border-b border-gray-50 last:border-0">
                                <td className="py-2 text-[12px] text-gray-600">{item.label}</td>
                                <td className="py-2 text-right">
                                  <span className="text-[12px] font-bold text-gray-800">{item.valor}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coluna Direita - Eventos */}
              <div className="w-full xl:w-[340px] shrink-0">
                <Evento />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default HomeDiretor;