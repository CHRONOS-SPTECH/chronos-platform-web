import { AlertTriangle } from "lucide-react";

function ConfirmDialog({
  aberto,
  titulo,
  mensagem,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  carregando = false,
  variant = "default",
}) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]" role="presentation">
      <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title" className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className={`h-1.5 w-full ${variant === "danger" ? "bg-red-500" : "bg-slate-900"}`} />
        <div className="p-6">
        <div className={`-mx-6 -mt-6 mb-5 flex items-start gap-3 border-b px-6 py-5 ${variant === "danger" ? "border-red-100 bg-gradient-to-r from-red-50 to-white" : "border-slate-200 bg-gradient-to-r from-slate-100 via-slate-50 to-white"}`}>
          {variant === "danger" && <span className="rounded-xl bg-red-50 p-2.5 text-red-600"><AlertTriangle size={20} /></span>}
          <div><h3 id="confirm-dialog-title" className="text-lg font-bold text-slate-800">{titulo}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{mensagem}</p></div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={carregando}
            className="h-10 rounded-xl bg-slate-100 px-4 text-xs font-bold text-slate-600 transition hover:bg-slate-200 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={carregando}
            className={`h-10 rounded-xl px-4 text-xs font-bold text-white transition disabled:cursor-wait disabled:opacity-60 ${variant === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-slate-900 hover:bg-blue-950"}`}
          >
            {carregando ? "Aguarde..." : confirmText}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
