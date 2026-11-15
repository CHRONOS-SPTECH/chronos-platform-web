import { useLocation, useNavigate } from "react-router-dom";
import Home from "lucide-react/icons/house";
import Users from "lucide-react/icons/users";
import Trophy from "lucide-react/icons/trophy";
import CalendarDays from "lucide-react/icons/calendar-days";
import Star from "lucide-react/icons/star";
import Target from "lucide-react/icons/target";
import Mic from "lucide-react/icons/mic";
import Palette from "lucide-react/icons/palette";
import Medal from "lucide-react/icons/medal";
import Wrench from "lucide-react/icons/wrench";

import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import useDashboardEngajamento from "../../hooks/useDashboardEngajamento";
import { ErrorState, LoadingState } from "../../components/ui/DataState";

const MODULOS = [
  { nome: "Panorama Acadêmico", rota: "/dashboard-academica" },
  { nome: "Engajamento de Ativid.", rota: "/engajamento-atividades" },
];

const formatarNumero = (valor) => Number(valor || 0).toLocaleString("pt-BR");

const limitarPercentual = (valor) => Math.min(100, Math.max(0, valor || 0));

const normalizar = (texto) =>
  String(texto || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");

function obterIconeCategoria(categoria) {
  const nome = normalizar(categoria);
  if (/palestra|workshop|curso|semin|aula/.test(nome)) return Mic;
  if (/cultur|ensaio|teatro|music|arte|danc/.test(nome)) return Palette;
  if (/torneio|esport|jogo|competi/.test(nome)) return Medal;
  if (/mutir|zelad|manuten|limpez|volunt/.test(nome)) return Wrench;
  return CalendarDays;
}

function obterCorPercentual(percentual) {
  if (percentual >= 80) return { barra: "bg-green-500", texto: "text-green-600" };
  if (percentual >= 60) return { barra: "bg-blue-500", texto: "text-blue-600" };
  return { barra: "bg-orange-400", texto: "text-orange-500" };
}

function BarraProgresso({ percentual, cor, altura = "h-2", fundo = "bg-slate-200" }) {
  return (
    <div
      className={`${altura} w-full overflow-hidden rounded-full ${fundo}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={limitarPercentual(percentual)}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${cor}`}
        style={{ width: `${limitarPercentual(percentual)}%` }}
      />
    </div>
  );
}

function ModulosDeControle() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <section aria-labelledby="titulo-modulos">
      <h2 id="titulo-modulos" className="text-base font-bold text-slate-600">
        Módulos de Controle
      </h2>
      <div className="mt-3 inline-flex flex-wrap gap-2 rounded-lg bg-slate-200/60 p-1.5">
        {MODULOS.map((modulo) => {
          const ativo = pathname === modulo.rota;
          return (
            <button
              key={modulo.rota}
              type="button"
              aria-current={ativo ? "page" : undefined}
              onClick={() => !ativo && navigate(modulo.rota)}
              className={`rounded-md px-3 py-1.5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2 ${
                ativo
                  ? "bg-green-700 font-bold text-white shadow-sm"
                  : "bg-slate-200 font-medium text-slate-700 hover:bg-slate-300"
              }`}
            >
              {modulo.nome}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function CardImpactoEventos({ impacto }) {
  return (
    <article className="flex min-h-[160px] flex-col justify-between rounded-xl border-l-4 border-green-700 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[13px] font-medium uppercase text-slate-700">
            Impacto dos Eventos
          </h3>
          <p className="mt-3 text-5xl font-black leading-none tracking-tight text-slate-800">
            {formatarNumero(impacto.total_participantes)}
          </p>
          <p className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-green-800">
            <Users size={13} strokeWidth={2.5} aria-hidden="true" />
            Total de Participantes
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-green-700">Adesão Média</p>
          <p className="mt-1 text-3xl font-black leading-none text-green-600">
            {impacto.adesao_media}
            <span className="text-lg">%</span>
          </p>
        </div>
      </div>
      <div className="mt-4">
        <BarraProgresso percentual={impacto.adesao_media} cor="bg-green-700" />
      </div>
    </article>
  );
}

function CardPublicoExterno({ publico }) {
  return (
    <article className="flex min-h-[160px] flex-col rounded-xl bg-white p-4 shadow-sm">
      <h3 className="text-[13px] font-medium uppercase text-slate-700">
        Público Externo
      </h3>
      <div className="mt-2 grid flex-1 grid-cols-1 items-center gap-4 sm:grid-cols-[auto_1fr]">
        <div className="sm:pr-6">
          <p className="text-5xl font-black leading-none tracking-tight text-slate-800">
            {formatarNumero(publico.alcance)}
          </p>
          <p className="mt-3 text-[11px] font-semibold uppercase text-blue-500">
            Alcance fora da escola
          </p>
        </div>
        <div className="border-slate-200 sm:self-stretch sm:border-l sm:pl-4 sm:pt-6">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase text-slate-700">
            <span>Taxa de Matrícula</span>
            <span className="text-xs font-bold">{publico.taxa_matricula}%</span>
          </div>
          <div className="mt-1">
            <BarraProgresso percentual={publico.taxa_matricula} cor="bg-blue-500" altura="h-1.5" />
          </div>
          <p className="mt-2 text-[10px] text-slate-600">
            Das <strong>{formatarNumero(publico.alcance)}</strong> pessoas,{" "}
            <strong>{formatarNumero(publico.convertidos)}</strong> tornaram-se alunos.
          </p>
        </div>
      </div>
    </article>
  );
}

function CardSecretariaDestaque({ secretaria }) {
  return (
    <article className="relative flex min-h-[160px] flex-col overflow-hidden rounded-xl bg-white p-3 shadow-sm">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 size-20 rounded-full border-[10px] border-yellow-100"
      />
      <div className="relative">
        <h3 className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
          Secretaria em Destaque
        </h3>
        <span className="mt-1.5 block h-0.5 w-8 rounded-full bg-yellow-400" />
      </div>

      {secretaria ? (
        <>
          <div className="relative mt-3 flex items-center gap-3">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-yellow-500 shadow-sm">
              <Trophy size={28} strokeWidth={2.2} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-black leading-tight text-slate-800" title={secretaria.nome}>
                {secretaria.nome}
              </p>
              <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-green-600">
                <CalendarDays size={11} aria-hidden="true" />
                {secretaria.total_eventos} {secretaria.total_eventos === 1 ? "Evento" : "Eventos"}
              </p>
              <p className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                <Star size={11} className="fill-yellow-400 text-yellow-400" aria-hidden="true" />
                {secretaria.taxa_sucesso}% de Sucesso
              </p>
            </div>
          </div>
          <div className="mt-auto pt-3">
            <div className="flex justify-between text-[8px] font-bold uppercase text-slate-400">
              <span>Taxa de Performance</span>
              <span className="text-slate-600">{secretaria.taxa_sucesso}%</span>
            </div>
            <div className="mt-1">
              <BarraProgresso percentual={secretaria.taxa_sucesso} cor="bg-yellow-400" altura="h-1.5" fundo="bg-slate-100" />
            </div>
          </div>
        </>
      ) : (
        <p className="mt-6 text-xs text-slate-500">
          Ainda não há eventos realizados com participantes registrados.
        </p>
      )}
    </article>
  );
}

function ItemPerformanceEvento({ evento, posicao }) {
  const abaixo = evento.abaixo_da_meta;

  return (
    <li className="relative overflow-hidden rounded-lg border border-slate-300 px-4 py-3">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-4 left-3 select-none text-5xl font-black italic text-slate-100"
      >
        {String(posicao).padStart(2, "0")}
      </span>
      <div className="relative grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_200px_90px]">
        <div className="min-w-0">
          <p className={`truncate text-[13px] font-bold ${abaixo ? "text-slate-600" : "text-slate-800"}`} title={evento.titulo}>
            {evento.titulo}
          </p>
          <p className={`mt-0.5 truncate text-[8px] font-bold uppercase tracking-wider ${abaixo ? "text-blue-500" : "text-green-600"}`}>
            {evento.secretaria}
          </p>
        </div>

        <div>
          <div className="flex justify-between text-[8px] font-semibold uppercase">
            <span className="italic text-slate-400">{abaixo ? "Abaixo da meta" : "Presença"}</span>
            <span className="text-slate-600">{evento.percentual_presenca}%</span>
          </div>
          <div className="mt-1">
            <BarraProgresso
              percentual={evento.percentual_presenca}
              cor={abaixo ? "bg-slate-300" : "bg-green-500"}
              altura="h-1"
              fundo="bg-slate-100"
            />
          </div>
        </div>

        <div className="text-right">
          <p className={`text-lg font-black leading-none ${abaixo ? "italic text-slate-400" : "text-slate-800"}`}>
            {formatarNumero(evento.presentes)}
          </p>
          <p className="mt-1 text-[8px] font-medium uppercase text-slate-400">Presentes</p>
        </div>
      </div>
    </li>
  );
}

function CardPerformanceEventos({ eventos, metaPresenca }) {
  return (
    <article className="flex min-h-[480px] flex-col rounded-xl bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-black italic uppercase tracking-wide text-slate-600">
          Performance por Evento/Oficina
        </h3>
        <span className="rounded bg-green-100 px-1.5 py-1 text-[9px] font-bold uppercase text-green-800">
          Dados em tempo real
        </span>
      </div>
      <p className="sr-only">Meta de presença: {metaPresenca}%.</p>

      {eventos.length > 0 ? (
        <ol className="mt-6 flex max-h-[560px] flex-col gap-3 overflow-y-auto pr-1">
          {eventos.map((evento, indice) => (
            <ItemPerformanceEvento key={evento.id_evento} evento={evento} posicao={indice + 1} />
          ))}
        </ol>
      ) : (
        <div className="mt-6 flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300 p-8 text-center">
          <div>
            <p className="font-semibold text-slate-700">Nenhum evento realizado com participantes</p>
            <p className="mt-1 text-sm text-slate-500">
              Os eventos aparecem aqui depois da data de realização, quando houver participações registradas.
            </p>
          </div>
        </div>
      )}
    </article>
  );
}

function CardAdesaoCategoria({ categorias }) {
  return (
    <article className="rounded-xl bg-white p-5 shadow-sm">
      <h3 className="text-[15px] font-black uppercase tracking-tight text-slate-800">
        Adesão por Categoria
      </h3>

      {categorias.length > 0 ? (
        <ul className="mt-5 flex flex-col gap-6">
          {categorias.map((item) => {
            const Icone = obterIconeCategoria(item.categoria);
            const cor = obterCorPercentual(item.percentual);
            return (
              <li key={item.categoria}>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-1.5 text-[10px] font-black uppercase text-slate-700">
                    <Icone size={11} className={cor.texto} aria-hidden="true" />
                    <span className="truncate">{item.categoria}</span>
                  </span>
                  <span className={`text-xs font-black ${cor.texto}`}>{item.percentual}%</span>
                </div>
                <div className="mt-2">
                  <BarraProgresso percentual={item.percentual} cor={cor.barra} fundo="bg-slate-100" />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-5 text-xs text-slate-500">Sem participações registradas por categoria.</p>
      )}
    </article>
  );
}

function CardPerformancePublico({ performance }) {
  return (
    <article className="flex gap-4 rounded-xl bg-white p-4 shadow-sm">
      <div className="flex w-14 shrink-0 flex-col items-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
          <Target size={24} strokeWidth={2.4} aria-hidden="true" />
        </div>
        <p className="mt-4 text-base font-black leading-none text-blue-700">
          {performance ? `+${Math.max(0, performance.percentual_acima_media)}%` : "--"}
        </p>
        <p className="mt-0.5 text-center text-[7px] font-bold uppercase text-blue-700">Em alcance</p>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] font-black uppercase leading-tight tracking-tight text-slate-800">
          Performance de Público
        </h3>
        <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.2em] text-green-600">
          Análise de espaços acadêmicos
        </p>

        {performance ? (
          <>
            <p className="mt-3 text-[11px] leading-snug text-slate-500">
              {performance.percentual_acima_media > 0 ? (
                <>
                  A adesão nas atividades realizadas no espaço{" "}
                  <strong className="text-blue-700">{performance.local}</strong> superou a média de
                  público da instituição.
                </>
              ) : (
                <>
                  O espaço <strong className="text-blue-700">{performance.local}</strong> tem a maior
                  média de público, em linha com a média da instituição.
                </>
              )}
            </p>
            <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50/70 p-2.5">
              <p className="text-[8px] font-bold uppercase text-blue-700">Recomendação estratégica:</p>
              <p className="mt-1 text-[9px] leading-snug text-slate-500">
                Priorizar a utilização do espaço {performance.local} para maximizar o engajamento e a
                visibilidade da instituição. Média de {formatarNumero(performance.media_presentes_local)}{" "}
                presentes por evento, contra {formatarNumero(performance.media_presentes_geral)} na média geral.
              </p>
            </div>
          </>
        ) : (
          <p className="mt-3 text-[11px] leading-snug text-slate-500">
            Informe o local dos eventos para comparar o público de cada espaço.
          </p>
        )}
      </div>
    </article>
  );
}

function DashboardEngajamento() {
  const {
    carregando,
    erro,
    carregarDashboard,
    metaPresenca,
    impacto,
    publicoExterno,
    secretariaDestaque,
    performanceEventos,
    adesaoCategorias,
    performancePublico,
  } = useDashboardEngajamento();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F6F8] font-sans">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header titulo="Dashboard's" icone={Home} />

        <main className="custom-scrollbar flex-1 overflow-y-auto">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-6 p-6">
            <ModulosDeControle />

            {carregando ? (
              <LoadingState message="Carregando engajamento das atividades..." />
            ) : erro ? (
              <ErrorState message={erro} onRetry={carregarDashboard} />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1.27fr_0.73fr]">
                  <CardImpactoEventos impacto={impacto} />
                  <CardPublicoExterno publico={publicoExterno} />
                  <CardSecretariaDestaque secretaria={secretariaDestaque} />
                </div>

                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_350px]">
                  <CardPerformanceEventos eventos={performanceEventos} metaPresenca={metaPresenca} />
                  <div className="flex flex-col gap-5">
                    <CardAdesaoCategoria categorias={adesaoCategorias} />
                    <CardPerformancePublico performance={performancePublico} />
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardEngajamento;
