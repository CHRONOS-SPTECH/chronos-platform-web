import Acoes from "../components/homeSecretario/Acoes";
import Evento from "../components/homeSecretario/Evento";
import Header from "../components/homeSecretario/Header";
import Profile from "../components/homeSecretario/Profile";
import Sidebar from "../components/sidebar/SideBar";
import Cronograma from "../components/homeInstrutor/Cronograma";

function HomeInstrutor() {
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* Sidebar Inteligente - Enviando apenas o tipo */}
      <Sidebar
        tipoUsuario="instrutor"
        usuario={{ inicial: "H", nome: "Henrique" }}
      />

      {/* Painel Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header com sombra sutil para separar do conteúdo */}
        <Header className="z-10 shadow-sm bg-white" />

        {/* Área de Conteúdo com Scroll Suave */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1600px] mx-auto p-8 flex flex-col gap-8">
            {/* Boas-vindas / Perfil */}
            <section className="animate-in fade-in duration-500">
              <Profile nome="Henrique" cargo="Instrutor" />
            </section>

            {/* Grid Principal: Ações/Cronograma vs Sidebar Direita */}
            <div className="flex flex-col xl:flex-row gap-8 items-start">
              {/* Coluna da Esquerda (Conteúdo Dinâmico) */}
              <div className="flex-1 flex flex-col gap-8 min-w-0 w-full">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <Acoes
                    titulo="MINHAS AÇÕES"
                    acaoPrincipal={{
                      texto: "Marcar Presença Agora",
                      icone: null, // O ícone já é tratado dentro do componente Acoes geralmente
                    }}
                    acoesSecundarias={[
                      { texto: "Minha Agenda" },
                      { texto: "Minhas Turmas" },
                    ]}
                  />
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-2">
                  <Cronograma />
                </div>
              </div>

              {/* Coluna da Direita (Eventos / Sidebar de Contexto) */}
              <aside className="w-full xl:w-[400px] shrink-0 sticky top-0">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <Evento />
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default HomeInstrutor;
