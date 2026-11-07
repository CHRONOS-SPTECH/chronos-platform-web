import { useEffect, useState } from "react";
import X from "lucide-react/icons/x";
import Check from "lucide-react/icons/check";
import CircleX from "lucide-react/icons/circle-x";
import GraduationCap from "lucide-react/icons/graduation-cap";
import LoaderCircle from "lucide-react/icons/loader-circle";
import turmaService from "../../../services/turmaService";
import { useToast } from "../../feedback/ToastProvider";

export default function ModalFormandos({ turma, onClose }) {
  const toast = useToast();
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [decidindo, setDecidindo] = useState(null);
  const carregar = async () => {
    setLoading(true);
    try {
      const page = await turmaService.listarFormandos(turma.id, { size: 100 });
      setItens(page?.content || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Não foi possível carregar os formandos.",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    carregar();
  }, [turma.id]);
  const decidir = async (pessoaId, aprovado) => {
    setDecidindo(pessoaId);
    try {
      await turmaService.decidirFormando(turma.id, pessoaId, { aprovado });
      toast.success(aprovado ? "Aluno aprovado." : "Aluno reprovado.");
      await carregar();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Não foi possível registrar a decisão.",
      );
    } finally {
      setDecidindo(null);
    }
  };
  const pendentes = itens.filter((item) => item.status === "PENDENTE").length;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="formandos-title"
        className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <header className="relative bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-900 px-6 py-6 text-white sm:px-8">
          <span className="absolute inset-x-0 top-0 h-1.5 bg-amber-300" />
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-violet-200">
                <GraduationCap size={14} /> Encerramento da turma
              </span>
              <h2 id="formandos-title" className="mt-3 text-2xl font-black">
                Quem concluiu a formação?
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Revise cada aluno e registre a decisão final.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar avaliações"
              className="rounded-xl p-2 text-slate-300 hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          <div className="mt-5 flex gap-2">
            <span className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold">
              {itens.length} alunos
            </span>
            <span className="rounded-xl bg-amber-300/15 px-3 py-2 text-xs font-bold text-amber-200">
              {pendentes} aguardando decisão
            </span>
          </div>
        </header>
        <div className="flex-1 space-y-2 overflow-y-auto bg-slate-50 p-4 sm:p-6">
          {loading ? (
            <div className="flex h-40 items-center justify-center gap-2 text-sm text-slate-500">
              <LoaderCircle className="animate-spin" size={18} /> Carregando
              avaliações…
            </div>
          ) : itens.length ? (
            itens.map((item) => (
              <article
                key={item.id_pessoa}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-sm font-black text-violet-800">
                  {(item.nome_aluno || "?").slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-slate-800">
                    {item.nome_aluno}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.observacao ||
                      (item.status === "PENDENTE"
                        ? "Sem decisão registrada"
                        : `Decisão registrada${item.data_decisao ? ` em ${item.data_decisao}` : ""}`)}
                  </p>
                </div>
                {item.status === "PENDENTE" ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={decidindo === item.id_pessoa}
                      onClick={() => decidir(item.id_pessoa, true)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 disabled:opacity-50"
                    >
                      <Check size={15} /> Aprovar
                    </button>
                    <button
                      type="button"
                      disabled={decidindo === item.id_pessoa}
                      onClick={() => decidir(item.id_pessoa, false)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-bold text-rose-800 hover:bg-rose-100 disabled:opacity-50"
                    >
                      <CircleX size={15} /> Reprovar
                    </button>
                  </div>
                ) : (
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-black ${item.status === "APROVADO" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}
                  >
                    {item.status === "APROVADO" ? "Aprovado" : "Reprovado"}
                  </span>
                )}
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <GraduationCap className="mx-auto text-slate-300" size={32} />
              <p className="mt-3 font-bold text-slate-700">
                Não há avaliações pendentes
              </p>
              <p className="mt-1 text-sm text-slate-500">
                A turma pode ter sido encerrada anteriormente.
              </p>
            </div>
          )}
        </div>
        <footer className="flex items-center justify-between border-t border-slate-100 bg-white px-5 py-4">
          <p className="text-xs text-slate-500">
            A aprovação atualiza o vínculo da pessoa para Membro.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white"
          >
            Concluir
          </button>
        </footer>
      </section>
    </div>
  );
}
