import { useState } from "react";
import { BookOpen, X } from "lucide-react";
import { useToast } from "../alert-toast/ToastProvider";
import turmaService from "../../services/turmaService";

export default function ModalTurma({
  isOpen,
  onClose,
  dadosAlunos,
}) {
  const toast = useToast();

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-b from-white to-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="bg-[#e8f5e9] p-2 rounded-lg">
              <BookOpen size={20} className="text-[#00871D]" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg leading-snug">
                {dadosAlunos?.nome_turma ? `Turma: ${dadosAlunos.nome_turma}` : "Alunos da Turma"}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Lista de alunos matriculados
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Lista de Alunos (Conteúdo Scrollável) */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-3 flex-1">
          {dadosAlunos?.alunos?.length > 0 ? (
            dadosAlunos.alunos.map((aluno) => (
              <div
                key={aluno.id_pessoa}
                className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-xl transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar com as iniciais do aluno */}
                  <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center shrink-0">
                    {aluno.nome?.substring(0, 2).toUpperCase() || "AL"}
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {aluno.nome}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {aluno.email}
                    </p>
                  </div>
                </div>

                {/* Badge de Status */}
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 ${aluno.status_pessoa === "Ativo"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {aluno.status_pessoa}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 font-medium">
                Nenhum aluno encontrado nesta turma.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
