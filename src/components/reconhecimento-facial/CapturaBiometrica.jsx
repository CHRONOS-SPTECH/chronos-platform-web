import React from "react";
import { useCapturaBiometrica } from "../../hooks/useCapturaBiometrica";

export const CapturaBiometrica = ({ aoCapturarFoto }) => {
  const {
    referenciaVideo,
    carregouModelos,
    erroCarregamento,
    rostoAlinhado,
    mensagemFeedback,
    previewFoto,
    tirarFoto,
    refazerFoto,
  } = useCapturaBiometrica(aoCapturarFoto);

  if (erroCarregamento) {
    return (
      <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
        {erroCarregamento}
      </div>
    );
  }

  if (!carregouModelos) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-slate-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
        <p className="text-sm">Carregando módulos de biometria facial...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
      <div className="relative w-full max-w-xs aspect-[0.75] bg-slate-900 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center">
        {!previewFoto ? (
          <>
            <video
              ref={referenciaVideo}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover -scale-x-100"
            />

            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div
                className={`w-56 h-72 rounded-[50%] border-4 transition-colors duration-300 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] flex items-center justify-center ${
                  rostoAlinhado
                    ? "border-green-500 bg-green-500/10"
                    : "border-red-500/80 bg-red-500/10"
                }`}
              >
                <span
                  className={`text-xs px-3 py-1 rounded-full text-white font-medium shadow backdrop-blur-md ${
                    rostoAlinhado ? "bg-green-600/80" : "bg-slate-900/80"
                  }`}
                >
                  {mensagemFeedback}
                </span>
              </div>
            </div>
          </>
        ) : (
          <img
            src={previewFoto}
            alt="Preview Biométrico"
            className="w-full h-full object-cover -scale-x-100"
          />
        )}
      </div>

      <p className="text-center text-xs font-medium text-slate-500">
        {previewFoto
          ? "Confira a foto antes de concluir o cadastro."
          : "Centralize o rosto no enquadramento 3 x 4."}
      </p>

      <div className="flex gap-3">
        {!previewFoto ? (
          <button
            type="button"
            onClick={tirarFoto}
            disabled={!rostoAlinhado}
            className={`px-6 py-2.5 font-medium rounded-lg transition-all shadow-sm ${
              rostoAlinhado
                ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                : "bg-slate-300 text-slate-500 cursor-not-allowed opacity-70"
            }`}
          >
            Capturar Foto
          </button>
        ) : (
          <button
            type="button"
            onClick={refazerFoto}
            className="px-6 py-2.5 bg-slate-700 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
          >
            Refazer Foto
          </button>
        )}
      </div>
    </div>
  );
};
