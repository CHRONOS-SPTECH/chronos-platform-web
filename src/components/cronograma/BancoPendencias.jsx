import React, { useState, useEffect } from "react";
import { X, PlusCircle, Trash2, GripVertical, Inbox } from "lucide-react";

export default function BancoPendencias({
  estaAberto,
  aoFechar,
  aulasPendentes,
  aoAdicionarAulaRapida,
  aoDeletarAulaPendente,
  turmas,
  turmaSelecionada,
  professores,
  temas,
  setMenuAberto,
}) {
  const [temaSelecionado, setTemaSelecionado] = useState("");
  const [professor, setProfessor] = useState("");
  const [turmaForm, setTurmaForm] = useState("");

  useEffect(() => {
    if (turmas && turmas.length > 0 && !turmaForm) {
      setTurmaForm(turmas[0].id_turma.toString());
    }
  }, [turmas, turmaForm]);

  useEffect(() => {
    if (professores && professores.length > 0 && !professor) {
      setProfessor(professores[0].id_pessoa.toString());
    }
  }, [professores, professor]);

  useEffect(() => {
    if (temas && temas.length > 0 && !temaSelecionado) {
      setTemaSelecionado(temas[0].id_tema.toString());
    }
  }, [temas, temaSelecionado]);

  const criarAula = (e) => {
    e.preventDefault();
    if (!temaSelecionado || !professor) return;

    const idTurmaFinal =
      turmaSelecionada === "todos"
        ? Number(turmaForm)
        : Number(turmaSelecionada);

    aoAdicionarAulaRapida({
      id_turma: idTurmaFinal,
      id_tema: Number(temaSelecionado),
      id_instrutor: Number(professor),
    });
  };

  const comecarArrastar = (e, aula) => {
    e.dataTransfer.setData("text/plain", aula.id);
    e.dataTransfer.setData("origem", "lista_pendencias");
    e.dataTransfer.effectAllowed = "move";
    const indicador = document.createElement("div");
    indicador.textContent = `↗ ${aula.tema} · movendo`;
    Object.assign(indicador.style, { position: "fixed", top: "-1000px", left: "-1000px", zIndex: "9999", padding: "8px 12px", borderRadius: "10px", background: "#312e81", color: "white", font: "600 12px sans-serif", boxShadow: "0 8px 24px rgba(15,23,42,.25)", pointerEvents: "none", whiteSpace: "nowrap" });
    document.body.appendChild(indicador);
    e.dataTransfer.setDragImage(indicador, 16, 16);
    window.setTimeout(() => indicador.remove(), 1000);

    // Fecha o banco imediatamente após o início do arraste para liberar a Segunda-feira
    setTimeout(() => {
      setMenuAberto(false);
    }, 50);
  };

  return (
    <aside
      className={`absolute left-0 top-0 bottom-0 z-20 flex w-80 flex-col transform bg-slate-50 shadow-xl shadow-slate-950/20 ring-1 ring-slate-200 ${
        estaAberto ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 to-indigo-950 px-4 py-3 text-white">
        <div>
          <h2 className="text-xs font-black tracking-wider text-emerald-300 uppercase">
            Aulas Pendentes
          </h2>
          <p className="mt-0.5 text-[10px] text-slate-300">
            Arraste um cartão; o destino acende
          </p>
        </div>
        <button
          onClick={aoFechar}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-slate-300 transition hover:bg-white/20 hover:text-white"
        >
          <X size={14} />
        </button>
      </div>

      <div className="border-b border-slate-200/70 bg-white p-4">
        <p className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50"><PlusCircle size={13} className="text-emerald-600" /></span> Criar aula pendente
        </p>
        <form onSubmit={criarAula} className="space-y-2">
          <select
            value={temaSelecionado}
            onChange={(e) => setTemaSelecionado(e.target.value)}
          className="w-full rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-indigo-300"
          >
            {temas.length === 0 && (
              <option value="">Carregando temas...</option>
            )}
            {temas.map((t) => (
              <option key={t.id_tema} value={t.id_tema.toString()}>
                {t.titulo_tema}
              </option>
            ))}
          </select>

          {turmaSelecionada === "todos" ? (
            <select
              value={turmaForm}
              onChange={(e) => setTurmaForm(e.target.value)}
              className="w-full rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-indigo-300"
            >
              {turmas.map((t) => (
                <option key={t.id_turma} value={t.id_turma.toString()}>
                  Para: {t.nome_turma}
                </option>
              ))}
            </select>
          ) : (
            <div className="rounded-xl bg-indigo-50 px-3 py-2.5 text-[10px] font-bold text-indigo-700">
              Turma Vinculada:{" "}
              {turmas.find((t) => t.id_turma.toString() === turmaSelecionada)
                ?.nome_turma || "Carregando..."}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <select
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
              className="min-w-0 rounded-xl border-0 bg-slate-100 px-2 py-2.5 text-xs font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-300"
            >
              {professores.map((p) => (
                <option key={p.id_pessoa} value={p.id_pessoa.toString()}>
                  {p.nome}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-xl bg-indigo-700 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>

      <div className="custom-scroll flex-1 space-y-2 overflow-y-auto p-3">
        <div className="flex items-center justify-between px-1 pb-1"><span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Fila de pendências</span><span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">{aulasPendentes.length}</span></div>
        {aulasPendentes.length === 0 && <div className="rounded-2xl bg-white px-4 py-8 text-center shadow-sm ring-1 ring-slate-900/5"><span className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><Inbox size={18} /></span><p className="mt-3 text-xs font-bold text-slate-700">Nenhuma aula pendente</p><p className="mt-1 text-[10px] leading-relaxed text-slate-500">Crie uma aula acima ou ajuste os filtros de turma.</p></div>}
        {aulasPendentes.map((aula) => (
          <div
            key={aula.id}
            id={aula.id}
            draggable
            onDragStart={(e) => comecarArrastar(e, aula)}
            className="group cursor-grab rounded-2xl border-l-4 border-emerald-500 bg-white p-3.5 text-left shadow-sm ring-1 ring-slate-900/5 transition hover:-translate-y-0.5 hover:shadow-lg active:cursor-grabbing active:scale-[.99]"
          >
            <div className="flex justify-between items-start">
              <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[9px] font-black uppercase text-emerald-700">
                {aula.prof}
              </span>
              <button
                onClick={() => aoDeletarAulaPendente(aula.id)}
                className="rounded-lg p-1 text-slate-300 transition hover:bg-rose-50 hover:text-rose-600"
              >
                <Trash2 size={12} />
              </button>
            </div>
            <div className="mt-2 flex items-start justify-between gap-2"><p className="text-xs font-bold leading-snug text-slate-800">{aula.tema}</p><GripVertical size={15} className="mt-0.5 shrink-0 text-slate-300 transition group-hover:text-indigo-500" /></div>
            <span className="mt-1 block text-[10px] font-medium text-slate-500">
              Turma: {aula.turma}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
