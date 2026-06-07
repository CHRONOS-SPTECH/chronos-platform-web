import { useState } from "react";
import { BookOpen, X } from "lucide-react";
import turmaService from "../../services/turmaService";

export default function ModalTurma({ isOpen, onClose, onSalvar, carregando, valoresPadrao }) {
	const valoresIniciais = {
		nome_turma: "",
		data_inicio: "",
		data_encerramento: "",
		status_turma: "Não Iniciada",
	};

	const [formData, setFormData] = useState(valoresPadrao || valoresIniciais);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const validarFormulario = () => {
		if (!formData.nome_turma?.trim()) {
			alert("Nome da turma é obrigatório");
			return false;
		}
		if (!formData.data_inicio) {
			alert("Data de início é obrigatória");
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
			<div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-300">
				{/* Header */}
				<div className="sticky top-0 bg-linear-to-b from-white to-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="bg-[#e8f5e9] p-2 rounded-lg">
							<BookOpen size={20} className="text-[#00871D]" />
						</div>
						<div>
							<h2 className="font-bold text-gray-900 text-lg">
								{valoresPadrao?.id_turma ? "Editar Turma" : "Nova Turma"}
							</h2>
							<p className="text-xs text-gray-500 font-medium">Preencha os dados abaixo</p>
						</div>
					</div>
					<button
						onClick={handleClose}
						disabled={carregando}
						className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
					>
						<X size={20} className="text-gray-400" />
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
							value={formData.nome_turma}
							onChange={handleChange}
							placeholder="Ex: Turma A - 2024"
							disabled={carregando}
							className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
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
							className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
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
							className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm disabled:bg-gray-50 disabled:cursor-not-allowed transition-all"
						/>
					</div>

					{/* Status */}
					<div className="flex flex-col gap-1.5">
						<label className="text-sm font-semibold text-gray-700">
							Status *
						</label>
						<select
							name="status_turma"
							value={formData.status_turma}
							onChange={handleChange}
							disabled={carregando}
							className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm disabled:bg-gray-50 disabled:cursor-not-allowed transition-all bg-white"
						>
							<option value="Não Iniciada">Não Iniciada</option>
							<option value="Em Andamento">Em Andamento</option>
							<option value="Concluída">Concluída</option>
						</select>
					</div>

					{/* Informação */}
					<div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mt-4">
						<p className="text-xs text-blue-600 font-medium">
							💡 A data de encerramento é opcional. Você pode preenchê-la posteriormente.
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
