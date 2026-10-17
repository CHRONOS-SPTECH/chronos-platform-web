import { BookOpen, LoaderCircle, X } from "lucide-react";

export default function ModalTurmaAlunos({ isOpen, onClose, dadosAlunos, carregando, erro }) {
  if (!isOpen) return null;

  const alunos = Array.isArray(dadosAlunos)
    ? dadosAlunos
    : Array.isArray(dadosAlunos?.alunos)
      ? dadosAlunos.alunos
      : [];
  const nomeTurma = dadosAlunos?.nome_turma || dadosAlunos?.nomeTurma;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby="turma-alunos-title" className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <header className="relative flex items-center justify-between border-b border-slate-700 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-800 px-5 py-4 text-white">
          <span className="absolute inset-x-0 top-0 h-1 bg-[#1E7A3C]" />
          <div className="flex min-w-0 items-center gap-3">
            <span className="rounded-xl bg-white/10 p-2 text-emerald-300"><BookOpen size={19} /></span>
            <div className="min-w-0">
              <h2 id="turma-alunos-title" className="truncate text-base font-bold">{nomeTurma ? `Alunos — ${nomeTurma}` : "Alunos da turma"}</h2>
              <p className="mt-0.5 text-xs text-slate-300">{carregando ? "Carregando lista…" : erro ? "Falha ao carregar a lista" : `${alunos.length} alunos matriculados`}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar lista de alunos" className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"><X size={19} /></button>
        </header>

        <div className="min-h-40 space-y-2 overflow-y-auto bg-slate-50/70 p-5">
          {carregando ? (
            <div className="flex h-36 items-center justify-center gap-2 text-sm font-medium text-slate-500"><LoaderCircle size={18} className="animate-spin text-[#1E7A3C]" /> Carregando alunos…</div>
          ) : erro ? (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{erro}</div>
          ) : alunos.length ? (
            alunos.map((aluno, index) => {
              const nome = aluno.nome || aluno.nome_pessoa || "Aluno sem nome";
              const ativo = String(aluno.status_pessoa || aluno.status || "").toLowerCase() === "ativo";
              return (
                <article key={aluno.id_pessoa ?? aluno.id ?? `${nome}-${index}`} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 transition hover:border-blue-200 hover:shadow-sm">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-black text-blue-900">{nome.slice(0, 2).toUpperCase()}</span>
                    <div className="min-w-0"><p className="truncate text-sm font-bold text-slate-800">{nome}</p><p className="truncate text-xs text-slate-500">{aluno.email || aluno.email_pessoa || "E-mail não informado"}</p></div>
                  </div>
                  {aluno.status_pessoa || aluno.status ? <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${ativo ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>{aluno.status_pessoa || aluno.status}</span> : null}
                </article>
              );
            })
          ) : (
            <div className="flex h-36 flex-col items-center justify-center text-center"><span className="rounded-full bg-slate-200 p-3 text-slate-500"><BookOpen size={20} /></span><p className="mt-3 text-sm font-semibold text-slate-700">Nenhum aluno encontrado nesta turma.</p></div>
          )}
        </div>
        <footer className="flex justify-end border-t border-slate-200 bg-white px-5 py-3"><button type="button" onClick={onClose} className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200">Fechar</button></footer>
      </section>
    </div>
  );
}
