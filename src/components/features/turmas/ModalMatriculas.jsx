import { useEffect, useState } from "react";
import X from "lucide-react/icons/x";
import Search from "lucide-react/icons/search";
import UserPlus from "lucide-react/icons/user-plus";
import matriculaTurmaService from "../../../services/matriculaTurmaService";
import turmaService from "../../../services/turmaService";
import { useToast } from "../../feedback/ToastProvider";

export default function ModalMatriculas({ turma, onClose, onConcluido }) {
  const toast = useToast();
  const [pessoas, setPessoas] = useState([]);
  const [selecionadas, setSelecionadas] = useState([]);
  const [busca, setBusca] = useState("");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [pagina, setPagina] = useState(0);
  const [dadosPagina, setDadosPagina] = useState({
    content: [],
    totalPages: 0,
    totalElements: 0,
    number: 0,
  });
  const [erroLista, setErroLista] = useState("");
  useEffect(() => {
    let ativo = true;
    setLoading(true);
    setErroLista("");
    turmaService
      .listarAlunosDisponiveis(turma.id, { page: pagina, size: 20 })
      .then((dados) => {
        if (ativo) {
          setDadosPagina(dados);
          setPessoas(dados?.content || []);
        }
      })
      .catch((error) => {
        if (!ativo) return;
        const mensagem =
          error?.response?.status === 409
            ? "Esta turma não aceita novas matrículas porque está concluída ou inativa."
            : error?.response?.status === 404
              ? "A turma não foi encontrada."
              : error?.response?.data?.message ||
                "Não foi possível carregar alunos disponíveis.";
        setErroLista(mensagem);
        toast.error(mensagem);
      })
      .finally(() => {
        if (ativo) setLoading(false);
      });
    return () => {
      ativo = false;
    };
  }, [turma.id, pagina, toast]);
  const lista = pessoas.filter((p) =>
    `${p.nome} ${p.email || ""}`
      .toLocaleLowerCase("pt-BR")
      .includes(busca.trim().toLocaleLowerCase("pt-BR")),
  );
  const salvar = async () => {
    setSalvando(true);
    try {
      const resultado = await matriculaTurmaService.matricularLote({
        idTurma: turma.id,
        idsPessoas: selecionadas,
        dataMatricula: data || undefined,
      });
      toast.success(
        `${resultado.total_matriculado ?? selecionadas.length} matrícula(s) realizada(s).`,
      );
      if (resultado.total_com_erro)
        toast.error(
          `${resultado.total_com_erro} pessoa(s) não puderam ser matriculadas.`,
        );
      onConcluido?.();
      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Não foi possível concluir as matrículas.",
      );
    } finally {
      setSalvando(false);
    }
  };
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="matricula-title"
        className="flex max-h-[88vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <header className="relative flex items-center justify-between bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600 px-6 py-5 text-white">
          <span className="absolute inset-x-0 top-0 h-1.5 bg-lime-300" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-100">
              Gestão de turma
            </p>
            <h2 id="matricula-title" className="mt-1 text-xl font-black">
              Matricular alunos
            </h2>
            <p className="mt-1 text-sm text-emerald-100">{turma.nome}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-xl p-2 hover:bg-white/15"
          >
            <X size={20} />
          </button>
        </header>
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
            <Search size={16} className="text-slate-400" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar nesta página"
              className="min-w-0 flex-1 text-sm outline-none"
            />
          </label>
          <span className="whitespace-nowrap rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800">
            {selecionadas.length} selecionados
          </span>
        </div>
        <div className="min-h-48 flex-1 overflow-y-auto bg-slate-50/70 p-4">
          {loading ? (
            <p className="p-8 text-center text-sm text-slate-500">
              Buscando alunos disponíveis…
            </p>
          ) : erroLista ? (
            <p
              role="alert"
              className="m-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
            >
              {erroLista}
            </p>
          ) : lista.length ? (
            <div className="space-y-2">
              {lista.map((p) => (
                <label
                  key={p.id_pessoa}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition ${selecionadas.includes(p.id_pessoa) ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white hover:border-slate-300"}`}
                >
                  <input
                    type="checkbox"
                    checked={selecionadas.includes(p.id_pessoa)}
                    onChange={(e) =>
                      setSelecionadas((items) =>
                        e.target.checked
                          ? [...items, p.id_pessoa]
                          : items.filter((id) => id !== p.id_pessoa),
                      )
                    }
                    className="size-4 accent-emerald-700"
                  />
                  <span className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-black text-slate-600">
                    {(p.nome || "?").slice(0, 1).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-slate-800">
                      {p.nome}
                    </span>
                    <span className="block truncate text-xs text-slate-500">
                      {p.email || "Sem e-mail"}{" "}
                      {p.telefone ? `· ${p.telefone}` : ""}
                    </span>
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                    {p.tipo_vinculo || "Elegível"}
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-slate-500">
              {busca
                ? "Nenhum resultado nesta página."
                : "Não há alunos disponíveis para esta turma."}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-3 text-xs text-slate-500">
          <span>
            {dadosPagina.totalElements ?? pessoas.length} disponíveis · Página{" "}
            {(dadosPagina.number ?? pagina) + 1} de{" "}
            {Math.max(dadosPagina.totalPages ?? 0, 1)}
          </span>
          <span className="flex gap-2">
            <button
              type="button"
              disabled={pagina === 0 || loading}
              onClick={() => {
                setBusca("");
                setPagina((p) => p - 1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={pagina + 1 >= (dadosPagina.totalPages ?? 0) || loading}
              onClick={() => {
                setBusca("");
                setPagina((p) => p + 1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold disabled:opacity-40"
            >
              Próxima
            </button>
          </span>
        </div>
        <footer className="flex flex-col gap-3 border-t border-slate-100 bg-white p-5 sm:flex-row sm:items-end">
          <label className="flex-1 text-xs font-bold text-slate-600">
            Data da matrícula{" "}
            <span className="font-normal text-slate-400">(opcional)</span>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            />
          </label>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!selecionadas.length || salvando || loading}
            onClick={salvar}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-800 disabled:opacity-50"
          >
            <UserPlus size={16} />
            {salvando
              ? "Matriculando…"
              : `Matricular ${selecionadas.length || "selecionados"}`}
          </button>
        </footer>
      </section>
    </div>
  );
}
