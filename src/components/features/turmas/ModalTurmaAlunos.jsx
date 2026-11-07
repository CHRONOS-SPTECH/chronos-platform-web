import { useState } from "react";
import BookOpen from "lucide-react/icons/book-open";
import LoaderCircle from "lucide-react/icons/loader-circle";
import X from "lucide-react/icons/x";
import Trash2 from "lucide-react/icons/trash-2";
import matriculaTurmaService from "../../../services/matriculaTurmaService";
import { useToast } from "../../feedback/ToastProvider";

export default function ModalTurmaAlunos({
  isOpen,
  onClose,
  dadosAlunos,
  carregando,
  erro,
  pagina = 0,
  onMudarPagina,
  idTurma,
  onAtualizar,
}) {
  const toast = useToast();
  const [confirmarRemocao, setConfirmarRemocao] = useState(null);
  const [removendo, setRemovendo] = useState(null);
  if (!isOpen) return null;
  const alunos = Array.isArray(dadosAlunos?.alunos)
    ? dadosAlunos.alunos
    : Array.isArray(dadosAlunos)
      ? dadosAlunos
      : [];
  const paginaAtual = dadosAlunos?.pagina ?? pagina;
  const totalPaginas = dadosAlunos?.total_paginas ?? 1;
  const totalAlunos = dadosAlunos?.total_alunos ?? alunos.length;
  const remover = async (idPessoa) => {
    setRemovendo(idPessoa);
    try {
      await matriculaTurmaService.removerMatricula(idTurma, idPessoa);
      toast.success("Matrícula removida.");
      setConfirmarRemocao(null);
      onAtualizar?.();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Não foi possível remover a matrícula.",
      );
    } finally {
      setRemovendo(null);
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="turma-alunos-title"
        className="flex max-h-[86vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
      >
        <header className="relative flex items-center justify-between bg-gradient-to-br from-sky-950 via-slate-900 to-indigo-950 px-6 py-5 text-white">
          <span className="absolute inset-x-0 top-0 h-1.5 bg-sky-400" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.18em] text-sky-200">
              Lista da turma
            </p>
            <h2 id="turma-alunos-title" className="mt-1 text-xl font-black">
              {dadosAlunos?.nome_turma ||
                dadosAlunos?.nomeTurma ||
                "Alunos matriculados"}
            </h2>
            <p className="mt-1 text-xs text-slate-300">
              {totalAlunos} alunos · página {paginaAtual + 1} de{" "}
              {Math.max(1, totalPaginas)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar lista de alunos"
            className="rounded-xl p-2 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </header>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-3">
          <p className="text-sm font-bold text-slate-800">
            Alunos matriculados
          </p>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-800">
            {totalAlunos} pessoas
          </span>
        </div>
        <div className="min-h-48 flex-1 space-y-2 overflow-y-auto bg-slate-50/70 p-5">
          {carregando ? (
            <div className="flex h-40 items-center justify-center gap-2 text-sm text-slate-500">
              <LoaderCircle size={18} className="animate-spin text-sky-700" />
              Carregando lista…
            </div>
          ) : erro ? (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {erro}
            </div>
          ) : alunos.length ? (
            alunos.map((aluno, index) => {
              const nome = aluno.nome || aluno.nome_pessoa || "Aluno sem nome";
              const id = aluno.id_pessoa ?? aluno.id;
              return (
                <article
                  key={id ?? `${nome}-${index}`}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-sky-200 hover:shadow-sm"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100 text-sm font-black text-indigo-900">
                    {nome.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-slate-800">
                      {nome}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-slate-500">
                      {aluno.email ||
                        aluno.email_pessoa ||
                        "E-mail não informado"}
                    </span>
                  </span>
                  {aluno.status_pessoa && (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                      {aluno.status_pessoa}
                    </span>
                  )}
                  {confirmarRemocao === id ? (
                    <span className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={removendo === id}
                        onClick={() => remover(id)}
                        className="text-xs font-bold text-rose-700"
                      >
                        Confirmar
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmarRemocao(null)}
                        className="text-xs text-slate-500"
                      >
                        Cancelar
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmarRemocao(id)}
                      title={`Remover matrícula de ${nome}`}
                      aria-label={`Remover matrícula de ${nome}`}
                      className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </article>
              );
            })
          ) : (
            <div className="flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-center">
              <span className="rounded-2xl bg-slate-100 p-3 text-slate-500">
                <BookOpen size={20} />
              </span>
              <p className="mt-3 text-sm font-bold text-slate-700">
                Nenhum aluno nesta turma
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Use “Matricular alunos” no cabeçalho da página.
              </p>
            </div>
          )}
        </div>
        <footer className="flex items-center justify-between border-t border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button
              type="button"
              disabled={paginaAtual === 0 || carregando}
              onClick={() => onMudarPagina(paginaAtual - 1)}
              className="rounded-xl border border-slate-200 px-3 py-2 font-bold disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={paginaAtual + 1 >= totalPaginas || carregando}
              onClick={() => onMudarPagina(paginaAtual + 1)}
              className="rounded-xl border border-slate-200 px-3 py-2 font-bold disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
          >
            Fechar
          </button>
        </footer>
      </section>
    </div>
  );
}
