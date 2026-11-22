import AlertCircle from "lucide-react/icons/circle-alert";
import ArrowUpRight from "lucide-react/icons/arrow-up-right";
import CheckCircle from "lucide-react/icons/circle-check-big";
import Clock from "lucide-react/icons/clock";
import GraduationCap from "lucide-react/icons/graduation-cap";

function chamadaFoiFeita(item) {
  return Boolean(item?.chamadaFeita ?? item?.aula?.chamadaFeita);
}

export default function AgendaGrade({ aulas, onSelecionarAula, textoVazio }) {
  if (!aulas.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-10 text-center">
        <p className="text-sm font-semibold text-slate-700">{textoVazio}</p>
        <p className="mt-1 text-xs text-slate-500">
          Escolha outro dia ou altere o filtro para consultar suas aulas.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {aulas
        .slice()
        .sort((a, b) =>
          (a?.aula?.hora_inicio || "").localeCompare(b?.aula?.hora_inicio || ""),
        )
        .map((item) => {
          const aula = item?.aula || {};
          const chamadaConcluida = chamadaFoiFeita(item);
          const idTurma = aula.id_turma ?? item?.turma?.id_turma;
          const idAula = aula.id_aula;
          const horario = aula.hora_inicio
            ? aula.hora_inicio.slice(0, 5)
            : "--:--";

          return (
            <button
              key={idAula}
              type="button"
              onClick={() => onSelecionarAula(idTurma, idAula)}
              disabled={!idTurma || !idAula}
              className="group flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-emerald-300 hover:shadow-md hover:shadow-slate-900/5 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-row sm:items-center sm:p-5"
              aria-label={`${chamadaConcluida ? "Consultar chamada" : "Fazer chamada"} da aula ${item?.tema?.titulo_tema || ""}, às ${horario}`}
            >
              <div
                className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${
                  chamadaConcluida
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {chamadaConcluida ? (
                  <CheckCircle size={22} />
                ) : (
                  <AlertCircle size={22} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h4 className="truncate text-sm font-bold text-slate-900 group-hover:text-emerald-800 sm:text-base">
                    {item?.tema?.titulo_tema || "Aula sem tema"}
                  </h4>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                      chamadaConcluida
                        ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                        : "border-amber-100 bg-amber-50 text-amber-700"
                    }`}
                  >
                    {chamadaConcluida ? "Chamada realizada" : "Chamada pendente"}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <GraduationCap size={14} />
                    {item?.turma?.nome_turma || `Turma ${idTurma || "—"}`}
                  </span>
                  {item?.materia?.nome && (
                    <span>{item.materia.nome}</span>
                  )}
                  {aula.hora_fim && (
                    <span>
                      {horario}–{aula.hora_fim.slice(0, 5)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-700">
                  <Clock size={15} className="text-slate-400" />
                  {horario}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800">
                  {chamadaConcluida ? "Ver chamada" : "Fazer chamada"}
                  <ArrowUpRight
                    size={15}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </button>
          );
        })}
    </div>
  );
}
