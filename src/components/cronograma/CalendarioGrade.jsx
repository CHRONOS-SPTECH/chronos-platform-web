import React, { useState } from "react";
import { ArrowDownToLine } from "lucide-react";
import { formatarDataLocal } from "../../utils/CronogramaUtils";

const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
const HORAS = Array.from({ length: 18 }, (_, i) => i + 6);

function CartaoAula({ item, aoSelecionar, arrastavel = true, aoIniciarArraste }) {
  const { aula } = item;
  const chamada = Boolean(item.chamadaFeita ?? aula.chamadaFeita);
  return (
    <button
      type="button"
      draggable={arrastavel && !chamada}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", String(aula.id_aula));
        e.dataTransfer.setData("origem", "calendario");
        e.dataTransfer.effectAllowed = "move";
        const imagemArraste = document.createElement("div");
        imagemArraste.textContent = `Mover · ${item.tema?.titulo_tema || "Aula"}`;
        Object.assign(imagemArraste.style, {
          position: "fixed", top: "-1000px", left: "-1000px", zIndex: "9999",
          padding: "7px 11px", borderRadius: "9px", background: "#312e81",
          color: "white", font: "600 12px sans-serif", boxShadow: "0 6px 18px rgba(15,23,42,.2)",
          pointerEvents: "none", whiteSpace: "nowrap",
        });
        document.body.appendChild(imagemArraste);
        e.dataTransfer.setDragImage(imagemArraste, 14, 14);
        window.setTimeout(() => imagemArraste.remove(), 1000);
        aoIniciarArraste?.();
      }}
      onDragEnd={aoIniciarArraste}
      onClick={() => aoSelecionar(item)}
      className={`w-full min-w-0 rounded-xl border-l-4 px-2.5 py-2 text-left shadow-sm ring-1 ring-slate-900/5 transition hover:-translate-y-0.5 hover:shadow-md ${chamada ? "border-emerald-500 bg-emerald-50" : "border-indigo-500 bg-white"}`}
    >
      <span className="block truncate text-[11px] font-bold text-slate-800">{item.tema?.titulo_tema || "Aula"}</span>
      <span className="mt-0.5 flex justify-between gap-1 text-[9px] text-slate-500">
        <span className="truncate">{item.turma?.nome_turma || `Turma ${aula.id_turma}`}</span>
        <span className={chamada ? "font-bold text-emerald-700" : "font-semibold text-indigo-600"}>{chamada ? "Presença feita" : "Pendente"}</span>
      </span>
      <span className="block truncate text-[9px] text-slate-500">{aula.hora_inicio?.slice(0, 5)} · {item.instrutor?.nome || "Instrutor"}</span>
    </button>
  );
}

export { CartaoAula };

export default function CalendarioGrade({ datasDaSemana, obterAulasPorDataHora, aoSoltarCard, aoSelecionar, aoDesalocar }) {
  const [alvoArraste, setAlvoArraste] = useState(null);
  return (
    <div className="h-full min-w-0 overflow-x-auto overflow-y-hidden rounded-3xl bg-slate-100 p-2 shadow-xl shadow-slate-300/30 ring-1 ring-slate-300/60">
      <div className="flex h-full min-w-[1200px] flex-col">
        <div className="z-10 grid shrink-0 grid-cols-[76px_repeat(7,minmax(150px,1fr))] overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-md">
          <div className="p-3 text-center text-[10px] font-bold uppercase text-indigo-200">Hora</div>
          {datasDaSemana.map((data, index) => (
            <div key={formatarDataLocal(data)} className="border-l border-white/10 p-2 text-center">
              <span className="block text-[10px] font-bold uppercase tracking-wide text-indigo-200">{DIAS[index]}</span>
              <span className="text-sm font-black text-white">{data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}</span>
            </div>
          ))}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-b-2xl">
          {HORAS.map((hora) => (
            <div key={hora} className="grid grid-cols-[76px_repeat(7,minmax(150px,1fr))]">
              <div className="border-b border-slate-200/70 bg-slate-200/80 px-2 py-2 text-center font-mono text-xs font-black text-indigo-950">{String(hora).padStart(2, "0")}:00</div>
              {datasDaSemana.map((data) => {
                const dataISO = formatarDataLocal(data);
                const chave = `${dataISO}-${hora}`;
                const estaSobCursor = alvoArraste === chave;
                const itens = obterAulasPorDataHora(dataISO, hora);
                return (
                  <div
                    key={chave}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                      if (alvoArraste !== chave) setAlvoArraste(chave);
                    }}
                    onDragLeave={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget)) setAlvoArraste(null);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setAlvoArraste(null);
                      aoSoltarCard(e, dataISO, hora);
                    }}
                    className={`relative min-h-[84px] space-y-1 border-b border-l p-1.5 transition-colors duration-100 ${estaSobCursor ? "z-10 border-2 border-dashed border-violet-500 bg-violet-100 shadow-[inset_0_0_0_2px_rgba(139,92,246,.12)]" : "border-slate-200/70 bg-white/75 hover:bg-indigo-50/70"}`}
                  >
                    {estaSobCursor && (
                      <span className="pointer-events-none absolute right-2 top-2 z-20 inline-flex items-center gap-1 rounded-full bg-violet-700 px-2 py-1 text-[10px] font-bold text-white shadow-md ring-2 ring-white">
                        <ArrowDownToLine size={12} /> {String(hora).padStart(2, "0")}:00
                      </span>
                    )}
                    {itens.map((item) => (
                      <div key={item.aula.id_aula} className="group relative">
                        <CartaoAula item={item} aoSelecionar={aoSelecionar} aoIniciarArraste={() => setAlvoArraste(null)} />
                        {!Boolean(item.chamadaFeita ?? item.aula.chamadaFeita) && (
                          <button type="button" onClick={() => aoDesalocar(item)} className="absolute right-1 top-1 hidden rounded-lg bg-white/95 px-1.5 py-1 text-[9px] font-bold text-rose-600 shadow-sm group-hover:block">Desalocar</button>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
