import { useEffect, useState } from "react";
import X from "lucide-react/icons/x";
import CalendarDays from "lucide-react/icons/calendar-days";
import UsersRound from "lucide-react/icons/users-round";
import TrendingUp from "lucide-react/icons/trending-up";
import ClipboardList from "lucide-react/icons/clipboard-list";
import LoaderCircle from "lucide-react/icons/loader-circle";
import turmaService from "../../services/turmaService";

const dataBr = (valor) => {
  if (!valor) return "—";
  const [ano, mes, dia] = String(valor).slice(0, 10).split("-").map(Number);
  return ano && mes && dia
    ? new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR")
    : "—";
};
const dataHoraBr = (valor) =>
  valor
    ? new Date(valor).toLocaleString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";
const percentual = (valor) =>
  Number.isFinite(Number(valor))
    ? `${Number(valor).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`
    : "—";

function Indicador({ icone: Icone, titulo, valor, cor }) {
  return (
    <article className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${cor}`}
      >
        <Icone size={19} />
      </span>
      <span>
        <span className="block text-xs font-semibold text-slate-500">
          {titulo}
        </span>
        <span className="mt-1 block text-lg font-black text-slate-900">
          {valor}
        </span>
      </span>
    </article>
  );
}

export default function ModalDetalhesTurma({ turma, onClose, onVerAlunos }) {
  const [detalhes, setDetalhes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  useEffect(() => {
    if (!turma?.id) return;
    let ativo = true;
    setLoading(true);
    setErro("");
    setDetalhes(null);
    turmaService
      .buscarDetalhes(turma.id)
      .then((dados) => {
        if (ativo) setDetalhes(dados);
      })
      .catch((error) => {
        if (ativo)
          setErro(
            error?.response?.data?.message ||
              "Não foi possível carregar os detalhes da turma.",
          );
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });
    return () => {
      ativo = false;
    };
  }, [turma?.id]);
  if (!turma) return null;
  const nome = detalhes?.nome_turma || turma.nome;
  const status = detalhes?.status_turma
    ? turmaService.normalizarStatusParaLabel(detalhes.status_turma)
    : turma.status;
  const progresso = detalhes?.percentual_conclusao ?? turma.progresso;
  const indicadores = detalhes?.indicadores;
  const proximaAula = detalhes?.proxima_aula;
  const responsavel = detalhes?.responsavel;
  return (
    <div
      className="fixed inset-0 z-[55] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="detalhes-title"
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-slate-50 shadow-2xl"
      >
        <header className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 px-6 py-7 text-white sm:px-8">
          <div className="absolute -right-10 -top-20 size-56 rounded-full border-[28px] border-white/[0.06]" />
          <div className="relative flex items-start justify-between">
            <div>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold text-emerald-100">
                DETALHES DA TURMA
              </span>
              <h2
                id="detalhes-title"
                className="mt-4 text-2xl font-black sm:text-3xl"
              >
                {nome}
              </h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                <CalendarDays size={15} />
                {dataBr(
                  detalhes?.data_inicio ||
                    turma.raw?.data_inicio ||
                    turma.raw?.dataInicio,
                )}{" "}
                <span className="text-slate-500">até</span>{" "}
                {dataBr(
                  detalhes?.data_encerramento ||
                    turma.raw?.data_encerramento ||
                    turma.raw?.dataEncerramento,
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar detalhes"
              className="rounded-xl p-2 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          <div className="relative mt-6 flex flex-wrap items-end justify-between gap-4">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold">
              {status}
            </span>
            <div className="min-w-40">
              <div className="mb-2 flex justify-between text-xs">
                <span className="text-slate-300">Progresso do período</span>
                <b>{percentual(progresso)}</b>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-lime-300"
                  style={{
                    width: `${Math.min(100, Math.max(0, Number(progresso) || 0))}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </header>
        <div className="overflow-y-auto p-5 sm:p-7">
          {loading ? (
            <div
              role="status"
              className="flex min-h-64 items-center justify-center gap-3 text-sm text-slate-500"
            >
              <LoaderCircle
                className="animate-spin text-emerald-700"
                size={20}
              />
              Carregando detalhes da turma…
            </div>
          ) : erro ? (
            <div
              role="alert"
              className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800"
            >
              {erro}
            </div>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                <Indicador
                  icone={UsersRound}
                  titulo="Alunos matriculados"
                  valor={indicadores?.total_alunos ?? "—"}
                  cor="bg-blue-50 text-blue-700"
                />
                <Indicador
                  icone={TrendingUp}
                  titulo="Presença média"
                  valor={percentual(indicadores?.percentual_presenca_media)}
                  cor="bg-emerald-50 text-emerald-700"
                />
                <Indicador
                  icone={ClipboardList}
                  titulo="Aulas realizadas"
                  valor={`${indicadores?.aulas_realizadas ?? "—"} / ${indicadores?.aulas_planejadas ?? "—"}`}
                  cor="bg-violet-50 text-violet-700"
                />
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="font-black text-slate-800">Próxima aula</h3>
                  {proximaAula ? (
                    <div className="mt-4 flex items-start gap-3">
                      <span className="rounded-xl bg-amber-50 p-3 text-amber-700">
                        <CalendarDays size={19} />
                      </span>
                      <div>
                        <p className="text-sm font-bold capitalize text-slate-800">
                          {dataHoraBr(proximaAula.data_hora_inicio)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {proximaAula.tema || "Tema não informado"}
                        </p>
                        {proximaAula.data_hora_fim && (
                          <p className="mt-1 text-xs text-slate-400">
                            Até{" "}
                            {new Date(
                              proximaAula.data_hora_fim,
                            ).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                      Nenhuma próxima aula agendada.
                    </p>
                  )}
                </section>
                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="font-black text-slate-800">
                    Responsável pela próxima aula
                  </h3>
                  {responsavel ? (
                    <div className="mt-4 flex items-center gap-3">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-800">
                        <UsersRound size={19} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-800">
                          {responsavel.nome}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {responsavel.email || "E-mail não informado"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                      Sem responsável definido para uma próxima aula.
                    </p>
                  )}
                </section>
              </div>
            </>
          )}
          <button
            type="button"
            disabled={loading || Boolean(erro)}
            onClick={onVerAlunos}
            className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-950 disabled:opacity-50"
          >
            Abrir lista de alunos
          </button>
        </div>
        <footer className="flex justify-end border-t border-slate-200 bg-white px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100"
          >
            Fechar
          </button>
        </footer>
      </section>
    </div>
  );
}
