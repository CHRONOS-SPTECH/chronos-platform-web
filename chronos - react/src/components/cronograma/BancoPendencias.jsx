import React, { useState, useEffect } from "react";
import { X, PlusCircle, Trash2 } from "lucide-react";

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
  };

  return (
    <aside
      className={`absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-20 flex flex-col transform ${
        estaAberto ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
        <div>
          <h2 className="text-sm font-black tracking-wider text-green-400 uppercase">
            Aulas Pendentes
          </h2>
          <p className="text-[10px] opacity-60 uppercase mt-0.5">
            Arraste para a grade
          </p>
        </div>
        <button
          onClick={aoFechar}
          className="w-7 h-7 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer border-0"
        >
          <X size={14} />
        </button>
      </div>

      <div className="p-4 border-b bg-slate-50">
        <p className="text-[11px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
          <PlusCircle size={12} className="text-green-600" /> Criar Aula Rápida
        </p>
        <form onSubmit={criarAula} className="space-y-2">
          <select
            value={temaSelecionado}
            onChange={(e) => setTemaSelecionado(e.target.value)}
            className="w-full text-xs px-3 py-2 border rounded-lg bg-white text-slate-700 focus:outline-none focus:border-green-600 shadow-sm outline-none"
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
              className="w-full text-xs px-2 py-2 border rounded-lg bg-white text-slate-700 focus:outline-none focus:border-green-600 shadow-sm outline-none"
            >
              {turmas.map((t) => (
                <option key={t.id_turma} value={t.id_turma.toString()}>
                  Para: {t.nome_turma}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-[10px] bg-slate-200/60 text-slate-600 font-bold px-2 py-1.5 rounded-lg border border-slate-300 pointer-events-none">
              Turma Vinculada:{" "}
              {turmas.find((t) => t.id_turma.toString() === turmaSelecionada)
                ?.nome_turma || "Carregando..."}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <select
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
              className="text-xs px-2 py-2 border rounded-lg bg-white text-slate-700 focus:outline-none focus:border-green-600 shadow-sm outline-none"
            >
              {professores.map((p) => (
                <option key={p.id_pessoa} value={p.id_pessoa.toString()}>
                  {p.nome}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-lg py-2 transition-all shadow-sm cursor-pointer border-0"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 custom-scroll">
        {aulasPendentes.map((aula) => (
          <div
            key={aula.id}
            id={aula.id}
            draggable
            onDragStart={(e) => comecarArrastar(e, aula)}
            className="bg-white border-l-4 border-emerald-500 p-3 rounded-xl shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-all text-left"
          >
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                {aula.prof}
              </span>
              <button
                onClick={() => aoDeletarAulaPendente(aula.id)}
                className="text-slate-300 hover:text-red-500 transition-all text-[10px] cursor-pointer border-0 bg-transparent"
              >
                <Trash2 size={12} />
              </button>
            </div>
            <p className="text-xs font-bold text-slate-700 mt-2 leading-tight">
              {aula.tema}
            </p>
            <span className="text-[9px] block text-slate-400 mt-1 italic">
              Turma: {aula.turma}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
