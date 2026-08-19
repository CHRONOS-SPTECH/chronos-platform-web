import { AlertTriangle, X } from "lucide-react";

export default function ConfirmDeleteModal({ aberto, evento, carregando, onConfirm, onCancel }) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="confirmar-exclusao-titulo">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3"><div className="rounded-2xl bg-red-50 p-3 text-red-600"><AlertTriangle size={22} /></div><div><h2 id="confirmar-exclusao-titulo" className="text-lg font-black text-slate-800">Excluir evento?</h2><p className="mt-1 text-sm text-slate-500">Deseja realmente excluir este evento?</p></div></div>
          <button onClick={onCancel} disabled={carregando} className="rounded-xl p-1 text-slate-400 hover:bg-slate-100" aria-label="Fechar"><X size={20} /></button>
        </div>
        <p className="mt-5 rounded-2xl bg-amber-50 p-3 text-sm text-amber-800">Essa ação não poderá ser desfeita.</p>
        {evento?.titulo && <p className="mt-4 text-sm text-slate-600">Evento: <strong>{evento.titulo}</strong></p>}
        <div className="mt-6 flex justify-end gap-3"><button onClick={onCancel} disabled={carregando} className="rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 disabled:opacity-50">Cancelar</button><button onClick={onConfirm} disabled={carregando} className="rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-700 disabled:cursor-wait disabled:opacity-60">{carregando ? "Excluindo..." : "Excluir evento"}</button></div>
      </div>
    </div>
  );
}