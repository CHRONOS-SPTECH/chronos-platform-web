import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "lucide-react/icons/calendar";
import CalendarDays from "lucide-react/icons/calendar-days";
import ChevronLeft from "lucide-react/icons/chevron-left";
import ChevronRight from "lucide-react/icons/chevron-right";

import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import { EmptyState, LoadingState } from "../../components/ui/DataState";
import AgendaGrade from "../../components/features/agenda/AgendaGrade";
import useAgendaInstrutor from "../../hooks/useAgendaInstrutor";
import { formatarDataLocal } from "../../utils/CronogramaUtils";

const diasNome = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const filtrosChamada = [
  { id: "todas", label: "Todas" },
  { id: "pendentes", label: "Pendentes" },
  { id: "realizadas", label: "Realizadas" },
];

function chamadaFoiFeita(item) {
  return Boolean(item?.chamadaFeita ?? item?.aula?.chamadaFeita);
}

function obterIndiceDoDia(data) {
  return (data.getDay() + 6) % 7;
}

export default function AgendaInstrutorView() {
  const navigate = useNavigate();
  const {
    semana,
    setSemana,
    datasDaSemana,
    aulas,
    carregando,
    erro,
    instrutorInfo,
    semanaTexto,
    mesAnoTexto,
    carregarAulasDoInstrutor,
  } = useAgendaInstrutor();
  const [diaSelecionado, setDiaSelecionado] = useState(obterIndiceDoDia(new Date()));
  const [filtro, setFiltro] = useState("todas");

  const datasIso = useMemo(
    () => datasDaSemana.map((data) => formatarDataLocal(data)),
    [datasDaSemana],
  );
  const aulasDaSemana = useMemo(
    () =>
      aulas.filter((item) =>
        datasIso.includes(item?.aula?.data_aula?.split("T")[0]),
      ),
    [aulas, datasIso],
  );
  const aulasDoDia = useMemo(() => {
    const dataSelecionada = datasIso[diaSelecionado];
    return aulasDaSemana.filter(
      (item) => item?.aula?.data_aula?.split("T")[0] === dataSelecionada,
    );
  }, [aulasDaSemana, datasIso, diaSelecionado]);

  const contagemSemana = useMemo(
    () => ({
      total: aulasDaSemana.length,
      realizadas: aulasDaSemana.filter(chamadaFoiFeita).length,
      pendentes: aulasDaSemana.filter((item) => !chamadaFoiFeita(item)).length,
    }),
    [aulasDaSemana],
  );
  const aulasFiltradas = useMemo(() => {
    if (filtro === "pendentes") return aulasDoDia.filter((item) => !chamadaFoiFeita(item));
    if (filtro === "realizadas") return aulasDoDia.filter(chamadaFoiFeita);
    return aulasDoDia;
  }, [aulasDoDia, filtro]);
  const dataSelecionada = datasDaSemana[diaSelecionado];
  const hojeIso = formatarDataLocal(new Date());

  const selecionarHoje = () => {
    setSemana(0);
    setDiaSelecionado(obterIndiceDoDia(new Date()));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans antialiased text-slate-800">
      <Sidebar />

      <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          titulo={`Minha Agenda — ${instrutorInfo.nome || "Instrutor"}`}
          icone={Calendar}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
            <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-3 px-5 py-3 sm:px-8">
              <button
                type="button"
                aria-label="Semana anterior"
                onClick={() => setSemana(semana - 1)}
                className="flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <ChevronLeft size={19} />
              </button>
              <div className="min-w-0 flex-1 text-center">
                <p className="truncate text-sm font-bold capitalize text-slate-800">
                  {mesAnoTexto || "Carregando..."}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-slate-500">
                  {semanaTexto || "—"}
                </p>
              </div>
              <button
                type="button"
                aria-label="Próxima semana"
                onClick={() => setSemana(semana + 1)}
                className="flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <ChevronRight size={19} />
              </button>
              <button
                type="button"
                onClick={selecionarHoje}
                className="shrink-0 rounded-xl bg-emerald-700 px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800"
              >
                Hoje
              </button>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 p-5 sm:p-8">
            <section className="flex flex-col justify-between gap-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 text-white shadow-lg shadow-slate-900/10 sm:flex-row sm:items-end sm:p-8">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
                  <CalendarDays size={15} />
                  Agenda do instrutor
                </div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Organize sua semana
                </h1>
                <p className="mt-2 max-w-xl text-sm text-slate-300">
                  Acompanhe suas aulas e abra a chamada para registrar ou consultar as presenças.
                </p>
              </div>
            </section>

            {carregando ? (
              <LoadingState message="Buscando dados da agenda..." />
            ) : erro ? (
              <EmptyState
                title="Não foi possível carregar a agenda"
                description={erro}
                action={
                  <button
                    type="button"
                    onClick={carregarAulasDoInstrutor}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    Tentar novamente
                  </button>
                }
              />
            ) : (
              <>
                <section
                  aria-label="Resumo da semana"
                  className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-xs shadow-sm"
                >
                  <span className="font-semibold text-slate-600">
                    <strong className="mr-1.5 text-sm text-slate-900">{contagemSemana.total}</strong>
                    aulas
                  </span>
                  <span className="flex items-center gap-2 font-medium text-slate-600">
                    <span className="size-2 rounded-full bg-amber-500" />
                    <strong className="text-sm text-slate-900">{contagemSemana.pendentes}</strong>
                    pendentes
                  </span>
                  <span className="flex items-center gap-2 font-medium text-slate-600">
                    <span className="size-2 rounded-full bg-emerald-600" />
                    <strong className="text-sm text-slate-900">{contagemSemana.realizadas}</strong>
                    realizadas
                  </span>
                </section>

                <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-5 pt-5 sm:px-7 sm:pt-7">
                    <div className="mb-5 flex flex-col justify-between gap-1 sm:flex-row sm:items-end">
                      <div>
                        <h2 className="text-lg font-bold text-slate-900">Visão diária</h2>
                        <p className="mt-1 text-sm text-slate-500">Selecione um dia para ver os detalhes das aulas.</p>
                      </div>
                      <span className="text-xs font-semibold text-slate-400">
                        {aulasDoDia.length} {aulasDoDia.length === 1 ? "aula no dia" : "aulas no dia"}
                      </span>
                    </div>

                    <div className="grid grid-cols-7 gap-2 pb-5">
                      {datasDaSemana.map((data, index) => {
                        const iso = formatarDataLocal(data);
                        const totalDoDia = aulasDaSemana.filter(
                          (item) => item?.aula?.data_aula?.split("T")[0] === iso,
                        ).length;
                        const selecionado = diaSelecionado === index;
                        return (
                          <button
                            key={iso}
                            type="button"
                            aria-pressed={selecionado}
                            onClick={() => setDiaSelecionado(index)}
                            className={`flex min-w-0 flex-col items-center gap-1 rounded-2xl border px-1 py-3 transition sm:py-3.5 ${
                              selecionado
                                ? "border-emerald-700 bg-emerald-700 text-white shadow-md shadow-emerald-900/15"
                                : "border-slate-200 bg-white text-slate-500 hover:border-emerald-200 hover:bg-emerald-50/60"
                            }`}
                          >
                            <span className={`text-[10px] font-bold uppercase sm:text-xs ${selecionado ? "text-emerald-100" : "text-slate-400"}`}>
                              {diasNome[index]}
                            </span>
                            <span className="text-lg font-bold leading-tight sm:text-xl">{data.getDate()}</span>
                            <span className={`min-h-4 text-[10px] font-semibold ${selecionado ? "text-emerald-100" : "text-slate-400"}`}>
                              {totalDoDia ? `${totalDoDia} ${totalDoDia === 1 ? "aula" : "aulas"}` : "—"}
                            </span>
                            {iso === hojeIso && (
                              <span className={`size-1.5 rounded-full ${selecionado ? "bg-white" : "bg-emerald-600"}`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between gap-4 px-5 py-5 sm:flex-row sm:items-center sm:px-7">
                    <div>
                      <h3 className="text-base font-bold capitalize text-slate-900">
                        {dataSelecionada?.toLocaleDateString("pt-BR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {aulasDoDia.length} {aulasDoDia.length === 1 ? "aula agendada" : "aulas agendadas"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1" aria-label="Filtrar aulas por chamada">
                      {filtrosChamada.map(({ id, label }) => (
                        <button
                          key={id}
                          type="button"
                          aria-pressed={filtro === id}
                          onClick={() => setFiltro(id)}
                          className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                            filtro === id
                              ? "bg-white text-slate-900 shadow-sm"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="px-5 pb-6 sm:px-7">
                    {aulasDaSemana.length === 0 ? (
                      <EmptyState
                        title="Nenhuma aula nesta semana"
                        description="Não há aulas agendadas para este período."
                      />
                    ) : (
                      <AgendaGrade
                        aulas={aulasFiltradas}
                        onSelecionarAula={(idTurma, idAula) =>
                          navigate(`/presenca/${idTurma}/${idAula}`)
                        }
                        textoVazio={
                          aulasDoDia.length === 0
                            ? "Não há aulas agendadas para este dia."
                            : "Nenhuma aula corresponde a este filtro."
                        }
                      />
                    )}
                  </div>
                </section>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
