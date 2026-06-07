import { useEffect, useState } from "react";
import { GraduationCap, MapPin, X } from "lucide-react";

const TOTAL_ETAPAS = 3;

const valoresIniciais = {
	nome: "",
	email: "",
	telefone: "",
	genero: "",
	cpf: "",
	bolsista: false,
	url_foto_perfil: "",
	tipo_vinculo_id: 2,
	data_nascimento: "",
	data_ingresso: "",
	data_membro: "",
	data_saida: "",
	cep: "",
	logradouro: "",
	numero: "",
	complemento: "",
	bairro: "",
	cidade: "",
	uf: "",
};

const limparMascara = (valor) => String(valor || "").replace(/\D/g, "");

const normalizarPayload = (dados) => {
	const cpfLimpo = limparMascara(dados.cpf).slice(0, 11);

	return ({
		nome: dados.nome.trim(),
		email: dados.email.trim(),
		telefone: limparMascara(dados.telefone),
		genero: dados.genero || null,
		cpf: cpfLimpo || null,
		bolsista: Boolean(dados.bolsista),
		url_foto_perfil: null,
		tipo_vinculo_id: Number(dados.tipo_vinculo_id),
		data_nascimento: dados.data_nascimento || null,
		data_ingresso: dados.data_ingresso || null,
		data_membro: dados.data_membro || null,
		data_saida: dados.data_saida || null,
	});
};

export default function ModalAluno({
	isOpen,
	onClose,
	onSalvar,
	carregando = false,
	valoresPadrao,
}) {
	const [form, setForm] = useState(valoresIniciais);
	const [etapaAtual, setEtapaAtual] = useState(1);

	useEffect(() => {
		if (!isOpen) return;
		setForm({ ...valoresIniciais, ...(valoresPadrao || {}) });
		setEtapaAtual(1);
	}, [isOpen, valoresPadrao]);

	if (!isOpen) return null;

	const inputStyle =
		"w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-green-500/20 transition-all placeholder:text-gray-400 text-gray-700 disabled:opacity-50";

	const onChange = (event) => {
		const { name, value, type, checked } = event.target;
		const valorTratado =
			name === "cpf" ? limparMascara(value).slice(0, 11) : value;

		setForm((anterior) => ({
			...anterior,
			[name]: type === "checkbox" ? checked : valorTratado,
		}));
	};

	const salvarEtapaFinal = async () => {
		if (!onSalvar) return;
		await onSalvar(normalizarPayload(form));
	};

	const validarEtapaAtual = () => {
		if (etapaAtual !== 1) return true;

		if (!form.nome.trim() || !form.email.trim() || !form.telefone.trim()) {
			window.alert("Preencha nome, e-mail e telefone para continuar.");
			return false;
		}

		return true;
	};

	const avancarEtapa = () => {
		if (!validarEtapaAtual()) return;
		setEtapaAtual((anterior) => Math.min(anterior + 1, TOTAL_ETAPAS));
	};

	const voltarEtapa = () => {
		setEtapaAtual((anterior) => Math.max(anterior - 1, 1));
	};

	const tituloEtapa =
		etapaAtual === 1
			? "Dados Pessoais"
			: etapaAtual === 2
				? "Informacoes Complementares"
				: "Endereco (Opcional)";

	const iconeEtapa = etapaAtual === 3 ? <MapPin size={22} /> : <GraduationCap size={22} />;

	return (
		<div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
			<div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
				<div className="p-8">
					<div className="flex justify-between items-start mb-6">
						<div>
							<h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
								{iconeEtapa}
								{tituloEtapa}
							</h2>
							<p className="text-gray-400 text-sm font-medium">
								Etapa {etapaAtual} de {TOTAL_ETAPAS}.
							</p>
						</div>

						<button
							onClick={onClose}
							className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
							type="button"
						>
							<X size={24} />
						</button>
					</div>

					<div className="flex items-center gap-3 mb-6">
						<div
							className={`h-1.5 flex-1 rounded-full ${
								etapaAtual >= 1 ? "bg-green-600" : "bg-gray-200"
							}`}
						/>
						<div
							className={`h-1.5 flex-1 rounded-full ${
								etapaAtual >= 2 ? "bg-green-600" : "bg-gray-200"
							}`}
						/>
						<div
							className={`h-1.5 flex-1 rounded-full ${
								etapaAtual >= 3 ? "bg-green-600" : "bg-gray-200"
							}`}
						/>
					</div>

					<form
						onSubmit={(event) => event.preventDefault()}
						className="grid grid-cols-1 md:grid-cols-2 gap-4"
					>
						{etapaAtual === 1 && (
							<>
								<div className="md:col-span-2 flex flex-col gap-1.5">
								<label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
									Nome Completo
								</label>
								<input
									name="nome"
									required
									value={form.nome}
									onChange={onChange}
									className={inputStyle}
									placeholder="Ex: Nome Sobrenome"
								/>
								</div>

								<div className="flex flex-col gap-1.5">
								<label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
									E-mail
								</label>
								<input
									name="email"
									type="email"
									required
									value={form.email}
									onChange={onChange}
									className={inputStyle}
									placeholder="aluno@email.com"
								/>
								</div>

								<div className="flex flex-col gap-1.5">
								<label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
									Telefone
								</label>
								<input
									name="telefone"
									required
									value={form.telefone}
									onChange={onChange}
									className={inputStyle}
									placeholder="(11) 99999-9999"
								/>
								</div>

								<div className="flex flex-col gap-1.5">
								<label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
									Genero
								</label>
								<select
									name="genero"
									value={form.genero}
									onChange={onChange}
									className={inputStyle}
								>
									<option value="">Selecione</option>
									<option value="Masculino">Masculino</option>
									<option value="Feminino">Feminino</option>
									<option value="Outro">Outro</option>
								</select>
								</div>

								<div className="flex flex-col gap-1.5">
								<label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
									CPF (somente numeros)
								</label>
								<input
									name="cpf"
									value={form.cpf}
									onChange={onChange}
									maxLength={11}
									className={inputStyle}
									placeholder="12345678907"
								/>
								</div>

								<div className="flex flex-col gap-1.5">
								<label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
									Data de Nascimento
								</label>
								<input
									name="data_nascimento"
									type="date"
									value={form.data_nascimento}
									onChange={onChange}
									className={inputStyle}
								/>
								</div>
							</>
						)}

						{etapaAtual === 2 && (
							<>
								<div className="flex flex-col gap-1.5">
									<label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
										Tipo de Vinculo
									</label>
									<select
										name="tipo_vinculo_id"
										value={form.tipo_vinculo_id}
										onChange={onChange}
										className={inputStyle}
									>
										<option value={1}>Publico Externo</option>
										<option value={2}>Provacionista</option>
										<option value={3}>Membro</option>
										<option value={4}>Membro Forca Viva</option>
									</select>
								</div>

								<div className="md:col-span-2 flex items-center gap-2 px-1 py-2">
									<input
										id="bolsista"
										name="bolsista"
										type="checkbox"
										checked={form.bolsista}
										onChange={onChange}
										className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
									/>
									<label htmlFor="bolsista" className="text-sm text-gray-600 font-medium">
										Aluno bolsista
									</label>
								</div>

								<div className="flex flex-col gap-1.5">
									<label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
										Data de Ingresso
									</label>
									<input
										name="data_ingresso"
										type="date"
										value={form.data_ingresso}
										onChange={onChange}
										className={inputStyle}
									/>
								</div>

								<div className="flex flex-col gap-1.5">
									<label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
										Data de Membro
									</label>
									<input
										name="data_membro"
										type="date"
										value={form.data_membro}
										onChange={onChange}
										className={inputStyle}
									/>
								</div>

								<div className="flex flex-col gap-1.5">
									<label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
										Data de Saida
									</label>
									<input
										name="data_saida"
										type="date"
										value={form.data_saida}
										onChange={onChange}
										className={inputStyle}
									/>
								</div>
							</>
						)}

						{etapaAtual === 3 && (
							<>
								<div className="md:col-span-2 rounded-2xl bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700">
									Endereco e opcional. Voce pode concluir o cadastro sem preencher estes campos.
								</div>

								<div className="flex flex-col gap-1.5">
									<label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
										CEP
									</label>
									<input
										name="cep"
										value={form.cep}
										onChange={onChange}
										className={inputStyle}
										placeholder="00000-000"
									/>
								</div>

								<div className="flex flex-col gap-1.5">
									<label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
										Numero
									</label>
									<input
										name="numero"
										value={form.numero}
										onChange={onChange}
										className={inputStyle}
										placeholder="123"
									/>
								</div>

								<div className="md:col-span-2 flex flex-col gap-1.5">
									<label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
										Logradouro
									</label>
									<input
										name="logradouro"
										value={form.logradouro}
										onChange={onChange}
										className={inputStyle}
										placeholder="Rua, Avenida, etc."
									/>
								</div>

								<div className="md:col-span-2 flex flex-col gap-1.5">
									<label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
										Complemento
									</label>
									<input
										name="complemento"
										value={form.complemento}
										onChange={onChange}
										className={inputStyle}
										placeholder="Apto, bloco, referencia..."
									/>
								</div>

								<div className="flex flex-col gap-1.5">
									<label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
										Bairro
									</label>
									<input
										name="bairro"
										value={form.bairro}
										onChange={onChange}
										className={inputStyle}
									/>
								</div>

								<div className="flex flex-col gap-1.5">
									<label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
										Cidade
									</label>
									<input
										name="cidade"
										value={form.cidade}
										onChange={onChange}
										className={inputStyle}
									/>
								</div>

								<div className="flex flex-col gap-1.5">
									<label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
										UF
									</label>
									<input
										name="uf"
										value={form.uf}
										onChange={onChange}
										maxLength={2}
										className={inputStyle}
										placeholder="SP"
									/>
								</div>
							</>
						)}

						<div className="md:col-span-2 flex gap-3 mt-2">
							{etapaAtual === 1 ? (
								<button
									type="button"
									onClick={onClose}
									className="flex-1 py-3.5 rounded-2xl text-gray-500 font-bold text-sm hover:bg-gray-50 transition-colors"
								>
									Cancelar
								</button>
							) : (
								<button
									type="button"
									onClick={voltarEtapa}
									className="flex-1 py-3.5 rounded-2xl text-gray-500 font-bold text-sm hover:bg-gray-50 transition-colors"
								>
									Voltar
								</button>
							)}

							{etapaAtual < TOTAL_ETAPAS ? (
								<button
									type="button"
									onClick={avancarEtapa}
									disabled={carregando}
									className="flex-1 py-3.5 rounded-2xl bg-black text-white font-bold text-sm hover:bg-gray-800 shadow-xl shadow-gray-200 transition-all active:scale-95 disabled:opacity-70"
								>
									Proxima Etapa
								</button>
							) : (
								<button
									type="button"
									onClick={salvarEtapaFinal}
									disabled={carregando}
									className="flex-1 py-3.5 rounded-2xl bg-black text-white font-bold text-sm hover:bg-gray-800 shadow-xl shadow-gray-200 transition-all active:scale-95 disabled:opacity-70"
								>
									{carregando ? "Salvando..." : "Salvar Aluno"}
								</button>
							)}
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
