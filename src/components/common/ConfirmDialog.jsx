function ConfirmDialog({
  aberto,
  titulo,
  mensagem,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  carregando = false,
}) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold mb-3">{titulo}</h3>
        <p className="text-sm text-slate-600 mb-6">{mensagem}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg text-xs"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={carregando}
            className={`h-10 px-4 text-white font-bold rounded-lg text-xs ${carregando ? "bg-green-800 opacity-80 cursor-wait" : "bg-[#1E7A3C] hover:bg-[#165a2d]"}`}
          >
            {carregando ? "Aguarde..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
