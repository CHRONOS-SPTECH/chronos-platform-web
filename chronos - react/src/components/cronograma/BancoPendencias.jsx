import React, { useState } from "react";
import { X, PlusCircle, Trash2 } from "lucide-react";

export default function BancoPendencias({
  estaAberto,
  aoFechar,
  aulasPendentes,
  aoAdicionarAulaRapica,
  aoDeletarAulaPendente,
}) {
  const [tema, setTema] = useState("");
  const [professor, setProfessor] = useState("Sêneca");

  const criarAula = (e) => {
    e.preventDefault();
    if (!tema.trim()) return;

    aoAdicionarAulaRapica(tema, professor);
    setTema("");
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
          <input
            type="text"
            placeholder="Nome do tema/matéria..."
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:border-green-600 shadow-sm bg-white text-slate-700"
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
              className="text-xs px-2 py-2 border rounded-lg bg-white text-slate-700 focus:outline-none focus:border-green-600 shadow-sm outline-none"
            >
              <option value="Sêneca">Prof. Sêneca</option>
              <option value="Platão">Prof. Platão</option>
              <option value="Sócrates">Prof. Sócrates</option>
              <option value="Aristóteles">Prof. Aristóteles</option>
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
            className={`bg-white border-l-4 border-emerald-500 p-3 rounded-xl shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-all text-left`}
          >
            <div className="flex justify-between items-start">
              <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                Prof. {aula.prof}
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
          </div>
        ))}
      </div>
    </aside>
  );
}
