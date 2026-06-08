import React from "react";
import {
  X,
  FileSpreadsheet,
  CloudUpload,
  Info,
  AlertTriangle,
} from "lucide-react";

export default function ModalCargaLetiva({
  isOpen,
  onClose,
  arquivo,
  onSelecionarArquivo,
  onLimparArquivo,
  onConfirmar,
  carregando,
  relatorio,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg border border-slate-100 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header do Modal */}
        <div className="p-4 bg-slate-800 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <FileSpreadsheet size={15} className="text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Importar Planilha Ano Letivo
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-lg cursor-pointer border-0 transition-colors"
          >
            <X size={12} />
          </button>
        </div>

        {/* Corpo do Modal com Scroll Interno Global */}
        <div className="p-6 overflow-y-auto flex-1 custom-scroll bg-white">
          {!relatorio ? (
            /* PASSO 1: SELEÇÃO DE ARQUIVO */
            <>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Insira o arquivo Excel (.xlsx ou .xls) para popular a grade
                cadastral de aulas, turmas e ementas de forma automatizada.
              </p>

              <div className="border border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-slate-50/60">
                {arquivo ? (
                  <>
                    <FileSpreadsheet
                      size={32}
                      className="text-slate-600 mb-2"
                    />
                    <span className="text-xs font-bold text-slate-700 block max-w-full truncate px-4">
                      {arquivo.name}
                    </span>
                    <button
                      onClick={onLimparArquivo}
                      className="mt-2 text-[11px] font-bold text-red-500 border-0 bg-transparent cursor-pointer underline"
                    >
                      Alterar arquivo
                    </button>
                  </>
                ) : (
                  <>
                    <CloudUpload size={32} className="mb-2 text-slate-300" />
                    <span className="text-xs font-bold text-slate-600 block">
                      Planilha Cronograma
                    </span>
                    <label className="mt-3 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg shadow-xs hover:bg-slate-50 cursor-pointer inline-block transition-colors">
                      Selecionar Arquivo
                      <input
                        type="file"
                        accept=".xlsx, .xls"
                        className="hidden"
                        onChange={onSelecionarArquivo}
                      />
                    </label>
                  </>
                )}
              </div>
            </>
          ) : (
            /* PASSO 2: EXIBIÇÃO DO RELATÓRIO DO BACKEND */
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b pb-2 border-slate-100">
                <Info size={16} className="text-emerald-600" />
                <span>Resumo do Processamento</span>
              </div>

              {/* Cards de Indicadores */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                  <span className="block text-[10px] uppercase text-slate-400 font-bold">
                    Processados
                  </span>
                  <span className="text-lg font-black text-slate-700">
                    {relatorio.totalProcessado}
                  </span>
                </div>
                <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-3 text-center">
                  <span className="block text-[10px] uppercase text-emerald-600 font-bold">
                    Sucesso
                  </span>
                  <span className="text-lg font-black text-emerald-700">
                    {relatorio.totalSucesso}
                  </span>
                </div>
                <div
                  className={`${relatorio.totalFalhas > 0 ? "bg-rose-50/40 border-rose-100" : "bg-slate-50 border-slate-100"} border rounded-xl p-3 text-center`}
                >
                  <span
                    className={`block text-[10px] uppercase font-bold ${relatorio.totalFalhas > 0 ? "text-rose-600" : "text-slate-400"}`}
                  >
                    Falhas
                  </span>
                  <span
                    className={`text-lg font-black ${relatorio.totalFalhas > 0 ? "text-rose-700" : "text-slate-700"}`}
                  >
                    {relatorio.totalFalhas}
                  </span>
                </div>
              </div>

              {/* Tabela de Inconsistências com cabeçalho fixo e scroll interno */}
              {relatorio.falhas && relatorio.falhas.length > 0 && (
                <div className="mt-2 flex flex-col flex-1">
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold text-[11px] uppercase tracking-wider mb-2">
                    <AlertTriangle size={14} />
                    <span>Linhas com inconsistência encontradas</span>
                  </div>

                  {/* Container da tabela com tamanho fixo e scroll */}
                  <div className="border border-slate-200 rounded-lg overflow-y-auto max-h-56 custom-scroll">
                    <table className="w-full text-left text-[11px] border-collapse table-fixed">
                      <thead className="bg-slate-100 text-slate-500 font-bold uppercase sticky top-0 z-10 shadow-xs">
                        <tr>
                          <th className="p-2.5 text-center w-14 bg-slate-100">
                            Linha
                          </th>
                          <th className="p-2.5 w-1/2 bg-slate-100">
                            Turma / Contexto
                          </th>
                          <th className="p-2.5 bg-slate-100">Motivo do Erro</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-600 bg-white">
                        {relatorio.falhas.map((falha, index) => (
                          <tr
                            key={index}
                            className="hover:bg-slate-50/60 transition-colors"
                          >
                            <td className="p-2.5 font-bold text-center bg-slate-50/30 text-slate-500 border-r border-slate-100">
                              {falha.linha}
                            </td>
                            <td className="p-2.5 leading-tight truncate">
                              <span className="font-bold text-slate-800 block truncate">
                                {falha.turma || "N/A"}
                              </span>
                              <span className="text-[10px] text-slate-400 block truncate">
                                {falha.materia} • {falha.professor}
                              </span>
                            </td>
                            <td className="p-2.5 text-rose-600 font-semibold leading-tight text-xs">
                              {falha.motivoErro}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rodapé de Ações do Modal */}
        <div className="p-4 border-t border-slate-100 flex gap-2 justify-end bg-slate-50/50 shrink-0">
          {!relatorio ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs rounded-lg cursor-pointer transition-colors"
                disabled={carregando}
              >
                Cancelar
              </button>
              <button
                onClick={onConfirmar}
                disabled={!arquivo || carregando}
                className={`px-4 py-1.5 text-white font-bold text-xs rounded-lg border-0 transition-all ${
                  arquivo && !carregando
                    ? "bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                {carregando ? "Processando..." : "Confirmar Carga"}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg cursor-pointer border-0 transition-colors"
            >
              Concluir
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
