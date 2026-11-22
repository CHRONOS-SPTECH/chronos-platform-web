import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  LayoutDashboard,
  UserPlus,
  UserRoundCheck,
  Users,
} from "lucide-react";

import Header from "../../layout/Header";
import Sidebar from "../../layout/Sidebar";
import homeService from "../../../services/homeService";
import sessionService from "../../../services/sessionService";

const profiles = {
  diretor: {
    title: "Diretor",
    actions: [
      { label: "Panorama acadêmico", icon: LayoutDashboard, to: "/dashboard-academica" },
      { label: "Eventos", icon: CalendarDays, to: "/eventos" },
      { label: "Usuários", icon: Users, to: "/usuarios" },
    ],
    listTitle: "Acompanhamento da escola",
    chartTitle: "Eventos realizados por mês",
    chartCaption: "Eventos concluídos em cada mês",
    chartUnit: "eventos",
  },
  secretaria: {
    title: "Secretaria",
    actions: [
      { label: "Cadastrar aluno", icon: UserPlus, to: "/alunos" },
      { label: "Criar turma", icon: Users, to: "/turmas" },
      { label: "Organizar aulas", icon: CalendarDays, to: "/cronograma" },
    ],
    listTitle: "Pendências para resolver",
    allocationTitle: "Aulas não agendadas",
  },
  instrutor: {
    title: "Instrutor",
    actions: [
      { label: "Fazer chamada", icon: UserRoundCheck, action: "startAttendance" },
      { label: "Minha agenda", icon: CalendarDays, to: "/minha-agenda" },
    ],
    listTitle: "Sua agenda de hoje",
    chartTitle: "Carga horária desta semana",
    chartCaption: "Horas de aula previstas por dia",
    chartUnit: "h de aula",
  },
};

const queueLabels = {
  attendancePending: "Chamadas pendentes",
  eventsCompleted: "Eventos concluídos",
  attendanceRisk: "Alunos em risco de frequência",
  studentAwaitingPlacement: "Alunos aguardando enturmação",
  scheduleConflict: "Conflitos no cronograma",
};

const queueIcons = {
  attendancePending: ClipboardCheck,
  eventsCompleted: CalendarDays,
  attendanceRisk: CircleAlert,
  studentAwaitingPlacement: Users,
  scheduleConflict: BookOpen,
};

const queueRoutes = {
  attendancePending: "/gestao-aulas",
  eventsCompleted: "/eventos",
  attendanceRisk: "/dashboard-academica",
  studentAwaitingPlacement: "/alunos",
  scheduleConflict: "/cronograma",
};

const attendanceStatusLabels = {
  inProgress: "Em andamento",
  notStarted: "Não iniciada",
  attendancePending: "Chamada pendente",
  realized: "Realizada",
  completed: "Concluída",
};

const numberFormatter = new Intl.NumberFormat("pt-BR");

function formatNumber(value) {
  return typeof value === "number" && Number.isFinite(value)
    ? numberFormatter.format(value)
    : "—";
}

function formatDateTime(value, timeZone, options = {}) {
  if (!value || Number.isNaN(new Date(value).getTime())) {
    return "Data não disponível";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone,
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  }).format(new Date(value));
}

function formatPeriodDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
  return match ? `${match[3]}/${match[2]}/${match[1]}` : "—";
}

function getMetrics(role, indicators = {}) {
  if (role === "diretor") {
    return [
      { label: "Alunos ativos", value: indicators.activeStudents, detail: "Matrículas vigentes" },
      { label: "Turmas ativas", value: indicators.activeClasses, detail: "Em andamento" },
      { label: "Próximos eventos", value: indicators.upcomingEventsNext30Days, detail: "Nos próximos 30 dias" },
      { label: "Alunos com faltas recorrentes", value: indicators.studentsWithRecurringAbsences, detail: "Precisam de acompanhamento" },
    ];
  }

  if (role === "secretaria") {
    return [
      { label: "Matrículas ativas", value: indicators.activeEnrollments, detail: "Matrículas vigentes" },
      { label: "Turmas em andamento", value: indicators.classesInProgress, detail: "Em andamento" },
      { label: "Aulas nesta semana", value: indicators.lessonsScheduledThisWeek, detail: "Aulas programadas" },
      { label: "Alunos aguardando turma", value: indicators.studentsAwaitingPlacement, detail: "Sem turma vinculada" },
    ];
  }

  const weeklyLessons = indicators.lessonsScheduledThisWeek || {};
  return [
    {
      label: "Aulas nesta semana",
      value: weeklyLessons.total,
      detail: `${formatNumber(weeklyLessons.lessonsMarkedRealized)} realizadas · ${formatNumber(weeklyLessons.attendancePending)} chamadas pendentes`,
    },
    { label: "Aulas hoje", value: indicators.lessonsToday, detail: "Na sua agenda de hoje" },
    { label: "Turmas ativas", value: indicators.activeClasses, detail: "Em atividade" },
    { label: "Alunos nas suas turmas", value: indicators.studentsInClasses, detail: "Matriculados" },
  ];
}

function getQueueItems(entries = []) {
  return entries.map((entry, index) => {
    const Icon = queueIcons[entry.type] || CircleAlert;
    const relatedIds = Array.isArray(entry.relatedIds) ? entry.relatedIds : [];

    return {
      key: `${entry.type}-${index}`,
      icon: Icon,
      title: queueLabels[entry.type] || entry.type,
      count: entry.count,
      description: relatedIds.length
        ? `IDs relacionados: ${relatedIds.join(", ")}`
        : "Sem IDs relacionados",
      action: "Ver detalhes",
      to: queueRoutes[entry.type] || "/gestao-aulas",
    };
  });
}

function SectionTitle({ children }) {
  return <h2 className="mb-4 text-[13px] font-bold text-slate-800">{children}</h2>;
}

function Card({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.025)] ${className}`}
    >
      {children}
    </section>
  );
}

function EmptyCardState({ icon: Icon, title, description }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-5 py-8 text-center">
      <span className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
        <Icon size={21} />
      </span>
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      <p className="mt-1 max-w-[220px] text-xs leading-relaxed text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default function HomeConcepts({ role = "diretor", onStartAttendance }) {
  const profile = profiles[role];
  const navigate = useNavigate();
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const nomeUsuario = sessionService
    .getSession()
    ?.usuario?.pessoa?.nome?.trim()
    .split(/\s+/)[0];

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    homeService
      .getHome(role)
      .then((response) => {
        if (active) setHome(response);
      })
      .catch((requestError) => {
        if (!active) return;
        console.error(`Erro ao carregar a home de ${role}:`, requestError);
        setError(
          requestError?.response?.data?.message ||
            requestError?.response?.data?.erro ||
            requestError?.message ||
            "Não foi possível carregar os dados da home.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [role, reloadKey]);

  const timeZone = home?.meta?.timeZone || "America/Sao_Paulo";
  const indicators = home?.indicators || {};
  const metrics = getMetrics(role, indicators);
  const queue =
    role === "diretor"
      ? getQueueItems(home?.schoolFollowUp)
      : role === "secretaria"
        ? getQueueItems(home?.operationalQueue)
        : (home?.todaySchedule || []).map((lesson) => ({
            key: lesson.lessonId,
            icon: Clock3,
            title: `${formatDateTime(lesson.startsAt, timeZone, {
              day: undefined,
              month: undefined,
            })} · ${lesson.subject || "Aula"}`,
            description: `${lesson.turma?.name || "Turma não informada"} · ${lesson.room || "Sala não informada"}`,
            action:
              attendanceStatusLabels[lesson.attendanceStatus] ||
              lesson.attendanceStatus ||
              "Ver aula",
            to:
              lesson.turma?.id && lesson.lessonId
                ? `/presenca/${lesson.turma.id}/${lesson.lessonId}`
                : "/minha-agenda",
          }));

  const chart =
    role === "diretor"
      ? home?.eventsCompletedByMonth
      : role === "instrutor"
        ? home?.weeklyTeachingHours
        : null;
  const chartSeries = chart?.series || [];
  const chartUnit =
    chart?.unit === "hours"
      ? "h de aula"
      : chart?.unit === "events"
        ? "eventos"
        : profile.chartUnit;
  const events = home?.upcomingEvents || [];
  const allocations =
    home?.unscheduledLessons || home?.lessonsAwaitingInstructor || [];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f9f8] font-sans text-slate-800">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header titulo="Home" icone={LayoutDashboard} />
        <main className="custom-scrollbar flex-1 overflow-y-auto">
          <div className="w-full space-y-6 p-5 md:p-8">
            <div className="border-b border-slate-200 pb-5">
              <p className="mb-1 text-[11px] font-bold tracking-[.16em] text-emerald-700">
                {profile.title.toUpperCase()}
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-[28px]">
                Bem-vindo(a), {nomeUsuario || profile.title}.
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Acompanhe os principais dados e compromissos do dia.
              </p>
            </div>

            {loading ? (
              <Card className="p-6 text-sm text-slate-500" role="status">
                Carregando dados da home...
              </Card>
            ) : error ? (
              <Card className="flex flex-col items-start gap-3 p-6" role="alert">
                <p className="text-sm font-semibold text-red-700">{error}</p>
                <button
                  type="button"
                  onClick={() => setReloadKey((key) => key + 1)}
                  className="rounded-lg bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800"
                >
                  Tentar novamente
                </button>
              </Card>
            ) : (
              <>
                <div>
                  <SectionTitle>Acesso rápido</SectionTitle>
                  <div
                    className={`grid auto-rows-fr gap-3 ${
                      profile.actions.length === 2
                        ? "md:max-w-3xl md:grid-cols-2"
                        : "md:grid-cols-3"
                    }`}
                  >
                    {profile.actions.map(({ label, icon: Icon, to, action }, index) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() =>
                          action === "startAttendance"
                            ? onStartAttendance?.()
                            : navigate(to)
                        }
                        className={`group flex h-full min-h-[76px] items-center gap-3 rounded-2xl p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                          index === 0
                            ? "bg-[#1E7A3C] text-white shadow-md shadow-emerald-900/10 hover:bg-[#176332]"
                            : "border border-slate-200/80 bg-white text-slate-800 shadow-[0_2px_10px_rgba(15,23,42,0.025)] hover:border-emerald-200"
                        }`}
                      >
                        <span
                          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                            index === 0
                              ? "bg-white/15 text-white"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          <Icon size={19} />
                        </span>
                        <span className="flex-1 text-sm font-semibold">{label}</span>
                        <ChevronRight
                          size={16}
                          className={
                            index === 0
                              ? "text-white/60"
                              : "text-slate-300 transition group-hover:text-emerald-700"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <SectionTitle>Indicadores</SectionTitle>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {metrics.map((metric) => (
                      <Card
                        key={metric.label}
                        className="flex h-full min-h-[112px] flex-col justify-between p-4"
                      >
                        <p className="text-xs font-medium text-slate-500">{metric.label}</p>
                        <p className="mt-2 text-[27px] font-bold tracking-tight text-slate-900">
                          {formatNumber(metric.value)}
                        </p>
                        <p className="mt-1 text-[11px] font-medium text-slate-500">
                          {metric.detail}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="grid auto-rows-[360px] items-stretch gap-5 md:auto-rows-[380px] xl:grid-cols-3 xl:auto-rows-[390px]">
                  <QueueCard
                    title={profile.listTitle}
                    items={queue}
                    onNavigate={navigate}
                  />
                  <EventsCard
                    events={events}
                    timeZone={timeZone}
                    onNavigate={(id) => navigate(id ? `/eventos/${id}` : "/eventos")}
                  />
                  {role === "secretaria" ? (
                    <AllocationsCard
                      title={profile.allocationTitle}
                      allocations={allocations}
                      timeZone={timeZone}
                      onNavigate={() => navigate("/cronograma")}
                    />
                  ) : (
                    <WeeklyCard
                      title={profile.chartTitle}
                      caption={profile.chartCaption}
                      unit={chartUnit}
                      total={chart?.total}
                      series={chartSeries}
                      timeZone={timeZone}
                      periodStart={chart?.periodStart}
                      periodEnd={chart?.periodEnd}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function QueueCard({ title, items, onNavigate }) {
  const visibleItems = items.filter(
    ({ count }) => count == null || !Number.isFinite(Number(count)) || Number(count) > 0,
  );

  return (
    <Card className="flex h-full min-h-0 flex-col overflow-hidden p-5">
      <SectionTitle>{title}</SectionTitle>
      {visibleItems.length ? (
        <div className="min-h-0 flex-1 divide-y divide-slate-100 overflow-y-auto pr-1 custom-scrollbar">
          {visibleItems.map(({ key, icon: Icon, title: itemTitle, count, description, action, to }) => (
            <button
              key={key}
              type="button"
              onClick={() => onNavigate(to)}
              className="flex w-full items-center gap-3 py-3 text-left"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Icon size={17} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold">
                  {itemTitle} ({formatNumber(count)})
                </span>
                <span className="mt-1 block text-[11px] text-slate-500">
                  {description}
                </span>
              </span>
              <span className="text-[11px] font-semibold text-emerald-700">
                {action}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <EmptyCardState
          icon={ClipboardCheck}
          title="Tudo em dia!"
          description="Não há itens para acompanhar por aqui no momento."
        />
      )}
    </Card>
  );
}

function EventsCard({ events, timeZone, onNavigate }) {
  return (
    <Card className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex items-center justify-between bg-[#1E7A3C] px-5 py-4 text-white">
        <div className="flex items-center gap-2">
          <CalendarDays size={17} />
          <h2 className="text-xs font-bold uppercase tracking-wider">Próximos eventos</h2>
        </div>
        <span className="rounded-md bg-white/15 px-2 py-1 text-[10px] font-semibold">
          PRÓXIMOS
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3 custom-scrollbar">
        {events.length ? (
          <div className="space-y-2">
            {events.map((event, index) => {
              const date = event.startsAt ? new Date(event.startsAt) : null;
              const validDate = date && !Number.isNaN(date.getTime());
              const day = validDate
                ? new Intl.DateTimeFormat("pt-BR", {
                    timeZone,
                    day: "2-digit",
                  }).format(date)
                : "—";
              const month = validDate
                ? new Intl.DateTimeFormat("pt-BR", {
                    timeZone,
                    month: "short",
                  })
                    .format(date)
                    .replace(".", "")
                    .toUpperCase()
                : "";

              return (
                <button
                  key={event.id ?? `${event.title}-${index}`}
                  type="button"
                  onClick={() => onNavigate(event.id)}
                  className="group flex w-full items-center gap-4 rounded-xl border border-transparent p-3 text-left transition hover:border-emerald-100 hover:bg-emerald-50/50"
                >
                  <span className="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-emerald-700 group-hover:text-white">
                    <b className="text-sm leading-none">{day}</b>
                    <span className="mt-1 text-[9px] font-bold">{month}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-800">
                      {event.title}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      {formatDateTime(event.startsAt, timeZone, {
                        year: undefined,
                      })}
                      {event.location ? ` · ${event.location}` : ""}
                      {event.category ? ` · ${event.category}` : ""}
                    </span>
                  </span>
                  <ChevronRight
                    size={16}
                    className="text-slate-300 group-hover:text-emerald-700"
                  />
                </button>
              );
            })}
          </div>
        ) : (
          <EmptyCardState
            icon={CalendarDays}
            title="Sem eventos próximos"
            description="Os próximos eventos da escola aparecerão aqui."
          />
        )}
      </div>
      <button
        type="button"
        onClick={() => onNavigate(null)}
        className="flex w-full items-center justify-between border-t border-slate-100 bg-slate-50/70 px-5 py-3 text-xs font-bold text-emerald-800 transition hover:bg-emerald-50"
      >
        Ver todos os eventos <ArrowRight size={14} />
      </button>
    </Card>
  );
}

function WeeklyCard({
  title,
  caption,
  unit,
  total,
  series,
  timeZone,
  periodStart,
  periodEnd,
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeIndex = Math.min(selectedIndex, Math.max(series.length - 1, 0));
  const maxValue = Math.max(0, ...series.map((item) => item.value || 0));
  const hasChartData = series.some((item) => Number(item.value) > 0);

  return (
    <Card className="flex h-full min-h-0 flex-col overflow-hidden p-5">
      <div className="mb-4">
        <h2 className="text-[13px] font-bold text-slate-800">{title}</h2>
        <p className="mt-1 text-[11px] text-slate-500">{caption}</p>
      </div>
      <div className="mb-4 flex items-end justify-between gap-3">
        <strong className="text-2xl font-bold tracking-tight text-slate-900">
          {formatNumber(total)}
        </strong>
        <span className="text-[10px] text-slate-400">{unit}</span>
      </div>
      {periodStart && periodEnd && (
        <p className="mb-2 text-[10px] text-slate-400">
          {formatPeriodDate(periodStart)}{" "}
          –{" "}
          {formatPeriodDate(periodEnd)}
        </p>
      )}
      {hasChartData ? (
        <>
          <div className="flex min-h-[120px] max-h-[170px] flex-1 items-end justify-between gap-3 border-b border-slate-100 px-1">
            {series.map((item, index) => {
              const label = item.label || item.date || item.period;
              const value = Number(item.value) || 0;
              const barHeight = maxValue ? (value / maxValue) * 100 : 0;

              return (
                <button
                  key={item.date || item.period || `${label}-${index}`}
                  type="button"
                  aria-pressed={activeIndex === index}
                  aria-label={`${label}: ${value} ${unit}`}
                  onClick={() => setSelectedIndex(index)}
                  className="group flex h-full flex-1 flex-col items-center justify-end gap-2 rounded-t-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                >
                  <span
                    className={`text-[10px] font-semibold ${
                      activeIndex === index ? "text-emerald-800" : "text-slate-400"
                    }`}
                  >
                    {value}
                  </span>
                  <div className="flex min-h-0 w-full flex-1 items-end">
                    <div
                      className={`w-full rounded-t-md transition-colors ${
                        activeIndex === index
                          ? "bg-emerald-700"
                          : "bg-emerald-100 group-hover:bg-emerald-300"
                      }`}
                      style={{ height: `${barHeight}%` }}
                    />
                  </div>
                  <span
                    className={`pb-2 text-[9px] font-semibold ${
                      activeIndex === index ? "text-emerald-800" : "text-slate-400"
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
          <p aria-live="polite" className="mt-3 text-xs font-medium text-slate-600">
            {series[activeIndex]?.label || series[activeIndex]?.date || series[activeIndex]?.period}:{" "}
            {series[activeIndex]?.value} {unit}
          </p>
        </>
      ) : (
        <EmptyCardState
          icon={LayoutDashboard}
          title="Ainda sem dados"
          description="O gráfico será preenchido assim que houver registros neste período."
        />
      )}
    </Card>
  );
}

function AllocationsCard({ title, allocations, timeZone, onNavigate }) {
  return (
    <Card className="flex h-full min-h-0 flex-col overflow-hidden p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <CalendarDays size={18} />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-[13px] font-bold text-slate-800">{title}</h2>
            <p className="mt-1 text-[11px] text-slate-500">
              Aulas que precisam de atenção
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
            allocations.length
              ? "bg-amber-50 text-amber-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {allocations.length} {allocations.length === 1 ? "pendente" : "pendentes"}
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1 custom-scrollbar">
        {allocations.length ? (
          allocations.map((lesson, index) => (
            <button
              key={lesson.id ?? `${lesson.startsAt}-${index}`}
              type="button"
              onClick={onNavigate}
              className="group flex w-full items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50/40"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <CalendarDays size={17} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-slate-800">
                  {lesson.subject || "Aula"}
                </span>
                <span className="mt-1 block truncate text-[11px] text-slate-500">
                  {lesson.turma?.name || "Turma não informada"} ·{" "}
                  {lesson.startsAt
                    ? formatDateTime(lesson.startsAt, timeZone)
                    : "Sem horário definido"}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5">
                <span className="rounded-full bg-amber-50 px-2 py-1 text-[9px] font-semibold text-amber-700">
                  Pendente
                </span>
                <ChevronRight
                  size={15}
                  className="text-slate-300 transition group-hover:text-emerald-700"
                />
              </span>
            </button>
          ))
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 px-4 py-6 text-center">
              <span className="mx-auto mb-3 flex size-11 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                <CalendarDays size={20} />
              </span>
              <p className="text-sm font-semibold text-slate-700">
                Nenhuma aula pendente
              </p>
              <p className="mx-auto mt-1 max-w-[220px] text-xs leading-relaxed text-slate-500">
                Quando houver aulas para organizar, elas aparecerão aqui.
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={onNavigate}
          className="flex w-full items-center justify-between rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100"
        >
          Abrir cronograma <ArrowRight size={14} />
        </button>
      </div>
    </Card>
  );
}
