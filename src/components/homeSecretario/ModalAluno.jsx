import { useEffect, useState } from "react";
import { GraduationCap, MapPin, X, Loader2 } from "lucide-react";
import cepService from "../../services/cepService";
import { useToast } from "../alert-toast/ToastProvider";

const TOTAL_ETAPAS = 3;

const dadosIniciaisFormulario = {
  nome: "Natalia Silva",
  email: "nath@gmail.com",
  telefone: "1199999-9999",
  genero: "Feminino",
  cpf: "11111111111",
  bolsista: true,
  url_foto_perfil: "",
  tipo_vinculo_id: 4,
  data_nascimento: "2000-05-15",
  data_ingresso: "2022-03-01",
  data_membro: "2022-06-01",
  data_saida: "",
  id_endereco: null,
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
};

export default function ModalAluno({
  isOpen,
  onClose,
  onSalvar,
  carregando = false,
  valoresPadrao,
}) {
  const toast = useToast();
  const [formulario, setFormulario] = useState(dadosIniciaisFormulario);
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [buscandoCep, setBuscandoCep] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setFormulario({ ...dadosIniciaisFormulario, ...(valoresPadrao || {}) });
    setEtapaAtual(1);
  }, [isOpen, valoresPadrao]);

  useEffect(() => {
    const cepNumeros = formulario.cep.replace(/\D/g, "");

    if (cepNumeros.length === 8) {
      const buscarViaCep = async () => {
        try {
          setBuscandoCep(true);
          const resultado = await cepService.buscarEnderecoPorCep(cepNumeros);

          if (!resultado.erro) {
            setFormulario((anterior) => ({
              ...anterior,
              logradouro: resultado.logradouro || "",
              bairro: resultado.bairro || "",
              cidade: resultado.localidade || "",
              uf: resultado.uf || "",
            }));
          } else {
            toast.error("CEP não encontrado.");
          }
        } catch (erro) {
          console.error("Erro ao consultar CEP:", erro);
        } finally {
          setBuscandoCep(false);
        }
      };

      buscarViaCep();
    }
  }, [formulario.cep]);

  if (!isOpen) return null;

  const estiloInput =
    "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-green-500/20 transition-all placeholder:text-gray-400 text-gray-700 disabled:opacity-50";

  const lidarComMudancaInput = (evento) => {
    const { name, value, type, checked } = evento.target;
    let valorTratado = value;

    if (name === "cpf") valorTratado = value.replace(/\D/g, "").slice(0, 11);
    if (name === "cep") valorTratado = value.replace(/\D/g, "").slice(0, 8);

    setFormulario((anterior) => ({
      ...anterior,
      [name]: type === "checkbox" ? checked : valorTratado,
    }));
  };

  const validarCamposObrigatorios = () => {
    if (etapaAtual !== 1) return true;

    if (
      !formulario.nome.trim() ||
      !formulario.email.trim() ||
      !formulario.telefone.trim()
    ) {
      toast.error("Por favor, preencha Nome, E-mail e Telefone.");
      return false;
    }
    return true;
  };

  const avancar = () => {
    if (!validarCamposObrigatorios()) return;
    setEtapaAtual((anterior) => Math.min(anterior + 1, TOTAL_ETAPAS));
  };

  const voltar = () => {
    setEtapaAtual((anterior) => Math.max(anterior - 1, 1));
  };

  const enviarDadosFinais = () => {
    if (!onSalvar) return;

    const dadosPessoa = {
      nome: formulario.nome.trim(),
      email: formulario.email.trim(),
      telefone: formulario.telefone.replace(/\D/g, ""),
      genero: formulario.genero || null,
      cpf: formulario.cpf || null,
      bolsista: Boolean(formulario.bolsista),
      url_foto_perfil: formulario.url_foto_perfil || null,
      tipo_vinculo_id: Number(formulario.tipo_vinculo_id),
      data_nascimento: formulario.data_nascimento || null,
      data_ingresso: formulario.data_ingresso || null,
      data_membro: formulario.data_membro || null,
      data_saida: formulario.data_saida || null,
    };

    const cepLimpo = formulario.cep.replace(/\D/g, "");

    // Validação local rigorosa com base no DTO (se faltar algum campo essencial, envia nulo)
    const temEnderecoCompleto =
      cepLimpo.length === 8 &&
      formulario.logradouro.trim() &&
      formulario.numero.trim() &&
      formulario.bairro.trim() &&
      formulario.cidade.trim() &&
      formulario.uf.trim();

    const dadosEndereco = temEnderecoCompleto
      ? {
          id: formulario.id_endereco || null,
          cep: cepLimpo,
          logradouro: formulario.logradouro.trim(),
          numero: formulario.numero.trim(),
          complemento: formulario.complemento.trim(),
          bairro: formulario.bairro.trim(),
          cidade: formulario.cidade.trim(),
          uf: formulario.uf.trim().toUpperCase(),
        }
      : null; // Se estiver incompleto ou vazio, o back-end não receberá a requisição de endereço

    onSalvar(dadosPessoa, dadosEndereco);
  };

  const tituloEtapa =
    etapaAtual === 1
      ? "Dados Pessoais"
      : etapaAtual === 2
        ? "Informações Complementares"
        : "Endereço (Opcional)";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                {etapaAtual === 3 ? (
                  <MapPin size={22} />
                ) : (
                  <GraduationCap size={22} />
                )}
                {tituloEtapa}
              </h2>
              <p className="text-gray-400 text-sm font-medium">
                Etapa {etapaAtual} de {TOTAL_ETAPAS}.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div
              className={`h-1.5 flex-1 rounded-full ${etapaAtual >= 1 ? "bg-green-600" : "bg-gray-200"}`}
            />
            <div
              className={`h-1.5 flex-1 rounded-full ${etapaAtual >= 2 ? "bg-green-600" : "bg-gray-200"}`}
            />
            <div
              className={`h-1.5 flex-1 rounded-full ${etapaAtual >= 3 ? "bg-green-600" : "bg-gray-200"}`}
            />
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
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
                    value={formulario.nome}
                    onChange={lidarComMudancaInput}
                    className={estiloInput}
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
                    value={formulario.email}
                    onChange={lidarComMudancaInput}
                    className={estiloInput}
                    placeholder="aluno@email.com"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    Telefone
                  </label>
                  <input
                    name="telefone"
                    value={formulario.telefone}
                    onChange={lidarComMudancaInput}
                    className={estiloInput}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    Gênero
                  </label>
                  <select
                    name="genero"
                    value={formulario.genero}
                    onChange={lidarComMudancaInput}
                    className={estiloInput}
                  >
                    <option value="">Selecione</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    CPF (Somente números)
                  </label>
                  <input
                    name="cpf"
                    value={formulario.cpf}
                    onChange={lidarComMudancaInput}
                    maxLength={11}
                    className={estiloInput}
                    placeholder="12345678901"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    Data de Nascimento
                  </label>
                  <input
                    name="data_nascimento"
                    type="date"
                    value={formulario.data_nascimento}
                    onChange={lidarComMudancaInput}
                    className={estiloInput}
                  />
                </div>
              </>
            )}

            {etapaAtual === 2 && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    Tipo de Vínculo
                  </label>
                  <select
                    name="tipo_vinculo_id"
                    value={formulario.tipo_vinculo_id}
                    onChange={lidarComMudancaInput}
                    className={estiloInput}
                  >
                    <option value={1}>Público Externo</option>
                    <option value={2}>Provacionista</option>
                    <option value={3}>Membro</option>
                    <option value={4}>Membro Força Viva</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex items-center gap-2 px-1 py-2">
                  <input
                    id="bolsista"
                    name="bolsista"
                    type="checkbox"
                    checked={formulario.bolsista}
                    onChange={lidarComMudancaInput}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label
                    htmlFor="bolsista"
                    className="text-sm text-gray-600 font-medium"
                  >
                    Aluno Bolsista
                  </label>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    Data de Ingresso
                  </label>
                  <input
                    name="data_ingresso"
                    type="date"
                    value={formulario.data_ingresso}
                    onChange={lidarComMudancaInput}
                    className={estiloInput}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    Data de Membro
                  </label>
                  <input
                    name="data_membro"
                    type="date"
                    value={formulario.data_membro}
                    onChange={lidarComMudancaInput}
                    className={estiloInput}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    Data de Saída
                  </label>
                  <input
                    name="data_saida"
                    type="date"
                    value={formulario.data_saida}
                    onChange={lidarComMudancaInput}
                    className={estiloInput}
                  />
                </div>
              </>
            )}

            {etapaAtual === 3 && (
              <>
                <div className="md:col-span-2 rounded-2xl bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
                  {buscandoCep && (
                    <Loader2 className="animate-spin" size={16} />
                  )}
                  Os campos de endereço serão preenchidos sozinhos após
                  preencher o CEP com 8 números.
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    CEP
                  </label>
                  <input
                    name="cep"
                    value={formulario.cep}
                    onChange={lidarComMudancaInput}
                    maxLength={8}
                    className={estiloInput}
                    placeholder="00000000"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    Número
                  </label>
                  <input
                    name="numero"
                    value={formulario.numero}
                    onChange={lidarComMudancaInput}
                    className={estiloInput}
                    placeholder="123"
                  />
                </div>
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    Logradouro
                  </label>
                  <input
                    name="logradouro"
                    value={formulario.logradouro}
                    onChange={lidarComMudancaInput}
                    className={estiloInput}
                    placeholder="Rua, Avenida..."
                  />
                </div>
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    Complemento
                  </label>
                  <input
                    name="complemento"
                    value={formulario.complemento}
                    onChange={lidarComMudancaInput}
                    className={estiloInput}
                    placeholder="Apto, Bloco..."
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    Bairro
                  </label>
                  <input
                    name="bairro"
                    value={formulario.bairro}
                    onChange={lidarComMudancaInput}
                    className={estiloInput}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    Cidade
                  </label>
                  <input
                    name="cidade"
                    value={formulario.cidade}
                    onChange={lidarComMudancaInput}
                    className={estiloInput}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    UF
                  </label>
                  <input
                    name="uf"
                    value={formulario.uf}
                    onChange={lidarComMudancaInput}
                    maxLength={2}
                    className={estiloInput}
                    placeholder="SP"
                  />
                </div>
              </>
            )}

            <div className="md:col-span-2 flex gap-3 mt-2">
              <button
                type="button"
                onClick={etapaAtual === 1 ? onClose : voltar}
                className="flex-1 py-3.5 rounded-2xl text-gray-500 font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                {etapaAtual === 1 ? "Cancelar" : "Voltar"}
              </button>
              <button
                type="button"
                onClick={
                  etapaAtual < TOTAL_ETAPAS ? avancar : enviarDadosFinais
                }
                disabled={carregando || buscandoCep}
                className="flex-1 py-3.5 rounded-2xl bg-black text-white font-bold text-sm hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-70"
              >
                {etapaAtual < TOTAL_ETAPAS
                  ? "Próxima Etapa"
                  : carregando
                    ? "Salvando..."
                    : "Salvar Aluno"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
