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
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-b from-white to-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#e8f5e9] p-2 rounded-lg">
              <BookOpen size={20} className="text-[#00871D]" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">
                Alunos da turma: {dadosAlunos.nome_turma}
              </h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {dadosAlunos?.alunos?.map(aluno => {
          return (
            <div key={aluno.id_pessoa}>
              <p>{aluno.nome}</p>
              <p>{aluno.email}</p>
              <p>{aluno.status_pessoa}</p>
            </div>
          )
        })}

      </div>
    </div>
  );
}
