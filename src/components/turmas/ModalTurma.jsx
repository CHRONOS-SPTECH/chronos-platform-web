import { useEffect, useState } from "react";
import BookOpen from "lucide-react/icons/book-open";
import X from "lucide-react/icons/x";
import { useToast } from "../alert-toast/ToastProvider";

export default function ModalTurma({
  isOpen,
  onClose,
  onSalvar,
  carregando,
  valoresPadrao,
}) {
  const toast = useToast();
  const valoresIniciais = {
    nome_turma: "",
    data_inicio: "",
    data_encerramento: "",
    status_turma: "Não Iniciada",
  };

  const [formData, setFormData] = useState(valoresIniciais);
  useEffect(() => {
    if (!isOpen) return;
    setFormData(
      valoresPadrao
        ? {
            ...valoresPadrao,
            status_turma:
              valoresPadrao.status_turma ||
              valoresPadrao.statusTurma ||
              "Não Iniciada",
            data_inicio: String(
              valoresPadrao.data_inicio || valoresPadrao.dataInicio || "",
            ).slice(0, 10),
            data_encerramento: String(
              valoresPadrao.data_encerramento ||
                valoresPadrao.dataEncerramento ||
                "",
            ).slice(0, 10),
          }
        : valoresIniciais,
    );
  }, [isOpen, valoresPadrao]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validarFormulario = () => {
    if (!formData.nome_turma?.trim()) {
      toast.error("Nome da turma é obrigatório");
      return false;
    }
    if (!formData.data_inicio) {
      toast.error("Data de início é obrigatória");
      return false;
    }
    if (formData.nome_turma.trim().length > 100) {
      toast.error("O nome da turma deve ter até 100 caracteres.");
      return false;
    }
    if (
      formData.data_encerramento &&
      formData.data_encerramento < formData.data_inicio
    ) {
      toast.error("A data de encerramento não pode ser anterior ao início.");
      return false;
    }
    return true;
  };

  const normalizarPayload = () => {
    return {
      nome_turma: formData.nome_turma?.trim() || "",
      data_inicio: formData.data_inicio || "",
      data_encerramento: formData.data_encerramento || null,
      status_turma: formData.status_turma || "Não Iniciada",
    };
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const payload = normalizarPayload();
    await onSalvar(payload);

    setFormData(valoresPadrao || valoresIniciais);
  };

  const handleClose = () => {
    setFormData(valoresPadrao || valoresIniciais);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-300 border border-slate-200">
        <div className="absolute inset-x-0 top-0 z-20 h-1.5 rounded-t-3xl bg-[#1E7A3C]" />
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg shadow-sm">
              <BookOpen size={20} className="text-blue-200" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">
                {valoresPadrao?.id_turma ? "Editar Turma" : "Nova Turma"}
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                Preencha os dados abaixo
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={carregando}
            className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <X size={20} className="text-slate-300" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSalvar} className="p-6 space-y-4">
          {/* Nome da Turma */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Nome da Turma *
            </label>
            <input
              type="text"
              name="nome_turma"
              maxLength={100}
              value={formData.nome_turma}
              onChange={handleChange}
              placeholder="Ex: Turma A - 2024"
              disabled={carregando}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
            />
          </div>

          {/* Data de Início */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Data de Início *
            </label>
            <input
              type="date"
              name="data_inicio"
              value={formData.data_inicio}
              onChange={handleChange}
              disabled={carregando}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
            />
          </div>

          {/* Data de Encerramento */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Data de Encerramento
            </label>
            <input
              type="date"
              name="data_encerramento"
              value={formData.data_encerramento}
              onChange={handleChange}
              disabled={carregando}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
            />
          </div>

          <p className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800">
            O status é controlado pelas ações da turma para preservar o
            histórico acadêmico.
          </p>

          {/* Informação */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mt-4">
            <p className="text-xs text-blue-600 font-medium">
              💡 A data de encerramento é opcional. Você pode preenchê-la
              posteriormente.
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={carregando}
              className="flex-1 px-4 py-2 text-gray-700 font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={carregando}
              className="flex-1 px-4 py-2 text-white font-semibold bg-[#1E7A3C] hover:bg-[#165a2d] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {carregando ? "Salvando..." : "Salvar Turma"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
