import { useState } from "react";
import { Camera, Check, X } from "lucide-react";
import { CapturaBiometrica } from "./CapturaBiometrica";

export default function ModalBiometriaAluno({
  isOpen,
  onClose,
  onConfirmar,
  modoVisualizacao = false,
  fotoInicial = null,
}) {
  const [fotoCapturada, setFotoCapturada] = useState(null);

  if (!isOpen) return null;

  const lidarComFotoCapturada = (dados) => {
    setFotoCapturada(dados);
  };

  const fechar = () => {
    setFotoCapturada(null);
    onClose();
  };

  const confirmar = () => {
    if (!fotoCapturada) return;
    onConfirmar(fotoCapturada);
    setFotoCapturada(null);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5" role="presentation">
      <div role="dialog" aria-modal="true" aria-labelledby="biometria-titulo" className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl sm:max-h-[calc(100dvh-2.5rem)]">
        <div className="flex shrink-0 items-start justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <div className="flex items-center gap-2 text-slate-900">
              <Camera size={20} className="text-green-700" />
              <h2 id="biometria-titulo" className="text-lg font-bold">
                {modoVisualizacao ? "Foto biométrica" : "Registrar foto"}
              </h2>
            </div>
            <p className="mt-1 text-xs font-medium text-slate-500">
              {modoVisualizacao
                ? "Foto confirmada no cadastro do aluno."
                : "Centralize o rosto, capture e confirme a imagem."}
            </p>
          </div>
          <button
            type="button"
            onClick={fechar}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Fechar captura de foto"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 justify-center overflow-hidden px-4 py-3">
          {modoVisualizacao ? (
            <img
              src={fotoInicial}
              alt="Foto biométrica do aluno"
              className="max-h-full w-auto max-w-full rounded-2xl bg-slate-900 object-contain shadow-lg"
            />
          ) : (
            <CapturaBiometrica aoCapturarFoto={lidarComFotoCapturada} />
          )}
        </div>

        <div className="flex shrink-0 gap-3 border-t border-slate-100 px-5 py-3">
          <button
            type="button"
            onClick={fechar}
            className="flex-1 rounded-2xl py-3 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-50"
          >
            Fechar
          </button>
          {!modoVisualizacao && (
            <button
              type="button"
              onClick={confirmar}
              disabled={!fotoCapturada}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-green-700 py-3 text-sm font-bold text-white transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check size={16} />
              Confirmar foto
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
