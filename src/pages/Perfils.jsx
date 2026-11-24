import logoCronos from "../assets/logoChronos.svg";
import Card from "../components/features/autenticacao/Card";
import usePerfis from "../hooks/usePerfis";

function Perfils() {
  const { perfisDisponiveis } = usePerfis();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50 px-4 py-10 sm:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-emerald-400/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-32 size-[32rem] rounded-full bg-blue-400/10 blur-3xl"
      />

      <div className="relative flex w-full max-w-6xl flex-col items-center text-center">
        <div className="mb-6 rounded-2xl border border-white/80 bg-white/80 px-5 py-3 shadow-sm backdrop-blur">
          <img src={logoCronos} alt="Chronos" className="h-10 w-auto" />
        </div>

        <span className="rounded-full border border-emerald-100 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-800">
          Plataforma acadêmica
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Bem-vindo ao Chronos
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
          Selecione o perfil de acesso para continuar.
        </p>

        {perfisDisponiveis.length > 0 ? (
          <div className="mt-9 flex w-full flex-wrap justify-center gap-4">
            {perfisDisponiveis.map((perfil) => (
              <Card
                key={perfil.id}
                tipo={perfil.tipo}
                descricao={perfil.descricao}
                badge={perfil.badge}
                rota={perfil.rota}
              />
            ))}
          </div>
        ) : (
          <div className="mt-9 w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 p-6 text-left shadow-sm">
            <p className="font-semibold text-slate-800">
              Nenhum perfil disponível
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Não encontramos um perfil de acesso associado à sua conta. Entre em contato com a equipe responsável.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default Perfils;
