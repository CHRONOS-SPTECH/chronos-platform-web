import { BookOpen, Calendar, Eye, Pencil, Trash2 } from "lucide-react";

function CardTurma({ turma, onVer, onEditar, onExcluir }) {
  const status = String(turma.status || "").toLowerCase();
  const statusOriginal = String(turma.raw?.status_turma ?? turma.raw?.statusTurma ?? "").toLowerCase();
  const isFormado = status.includes("formad") || status.includes("conclu");
  const isInativa = status.includes("inativ") || statusOriginal.includes("inativ");

  return (
    <article className={`group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all ${isInativa ? "opacity-70" : "hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-900/10"}`}>
      <span className={`absolute inset-x-0 top-0 h-1 ${isInativa ? "bg-slate-300" : isFormado ? "bg-slate-500" : "bg-[#1E7A3C]"}`} />

      <div className="flex items-start justify-between">
        <div className={`rounded-xl p-3 ${isInativa ? "bg-slate-100" : "bg-blue-50"}`}>
          <BookOpen size={22} className={isInativa ? "text-slate-400" : "text-blue-800"} />
        </div>
        <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${isInativa ? "border-slate-200 bg-slate-100 text-slate-500" : isFormado ? "border-slate-200 bg-slate-100 text-slate-700" : "border-emerald-100 bg-emerald-50 text-emerald-800"}`}>
          {turma.status}
        </span>
      </div>

      <div>
        <h3 className="text-[15px] font-bold leading-snug text-slate-800">{turma.nome}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
          <Calendar size={13} className="text-slate-400" />
          <span>{turma.dataInicio}</span>
          <span className="text-slate-300">até</span>
          <span>{turma.dataFim || "Sem data final"}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500">Progresso do curso</span>
          <span className="text-[11px] font-black text-slate-700">{turma.progresso}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className={`h-full rounded-full transition-all ${isFormado ? "bg-slate-500" : "bg-[#1E7A3C]"}`} style={{ width: `${turma.progresso}%` }} />
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex gap-1">
          <button type="button" onClick={() => onVer?.(turma)} aria-label={`Ver alunos de ${turma.nome}`} title="Ver alunos" className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
            <Eye size={16} />
          </button>
          <button type="button" onClick={() => onEditar?.(turma)} disabled={isInativa} aria-label={`Editar ${turma.nome}`} title="Editar turma" className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40">
            <Pencil size={16} />
          </button>
          <button type="button" onClick={() => onExcluir?.(turma)} disabled={isInativa} aria-label={`Excluir ${turma.nome}`} title="Excluir turma" className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40">
            <Trash2 size={16} />
          </button>
        </div>
        <button type="button" onClick={() => onVer?.(turma)} className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-950">
          {isFormado ? "Ver histórico" : "Ver alunos"}
        </button>
      </div>
    </article>
  );
}

export default CardTurma;
