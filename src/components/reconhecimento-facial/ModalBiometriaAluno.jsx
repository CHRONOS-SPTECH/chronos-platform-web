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
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <div className="flex items-center gap-2 text-slate-900">
              <Camera size={20} className="text-green-700" />
              <h2 className="text-lg font-bold">
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

        <div className="flex justify-center px-6 py-5">
          {modoVisualizacao ? (
            <img
              src={fotoInicial}
              alt="Foto biométrica do aluno"
              className="aspect-[0.75] w-full max-w-xs rounded-2xl bg-slate-900 object-cover shadow-lg"
            />
          ) : (
            <CapturaBiometrica aoCapturarFoto={lidarComFotoCapturada} />
          )}
        </div>

        <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
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
