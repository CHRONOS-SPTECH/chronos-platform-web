import { useEffect, useState } from "react";
import Camera from "lucide-react/icons/camera";
import GraduationCap from "lucide-react/icons/graduation-cap";
import MapPin from "lucide-react/icons/map-pin";
import X from "lucide-react/icons/x";
import Loader2 from "lucide-react/icons/loader-circle";
import cepService from "../../../services/cepService";
import pessoaService from "../../../services/pessoaService";
import turmaService from "../../../services/turmaService";
import { useToast } from "../../feedback/ToastProvider";
import ModalBiometriaAluno from "../biometria/ModalBiometriaAluno";

const TOTAL_ETAPAS = 3;

const dadosIniciaisFormulario = {
  nome: "",
  email: "",
  telefone: "",
  genero: "",
  cpf: "",
  bolsista: false,
  url_foto_perfil: "",
  tipo_vinculo_id: "",
  data_nascimento: "",
  data_ingresso: "",
  data_membro: "",
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
  foto_biometrica: null,
  vetor_biometrico: null,
};

export default function ModalAluno({
  isOpen,
  onClose,
  onSalvar,
  carregando = false,
  valoresPadrao,
  publicoExterno = false,
}) {
  const toast = useToast();
  const [formulario, setFormulario] = useState(dadosIniciaisFormulario);
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [modalBiometriaAberto, setModalBiometriaAberto] = useState(false);
  const [modoVisualizacaoFoto, setModoVisualizacaoFoto] = useState(false);
  const [tiposVinculo, setTiposVinculo] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [idTurma, setIdTurma] = useState("");
  const [buscandoCep, setBuscandoCep] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    pessoaService.listarTiposVinculo().then(setTiposVinculo).catch((error) => {
      console.error("Erro ao carregar tipos de vínculo:", error);
      toast.error("Não foi possível carregar os tipos de vínculo.");
    });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || publicoExterno || valoresPadrao) return;
    turmaService.listarTurmas().then(setTurmas).catch((error) => {
      console.error("Erro ao carregar turmas:", error);
      toast.error("Não foi possível carregar as turmas para matrícula.");
    });
  }, [isOpen, publicoExterno, valoresPadrao]);

  useEffect(() => {
    if (!isOpen) return;
    setFormulario({ ...dadosIniciaisFormulario, ...(valoresPadrao || {}) });
    setEtapaAtual(1);
    setIdTurma("");
    setModalBiometriaAberto(false);
    setModoVisualizacaoFoto(false);
  }, [isOpen, valoresPadrao]);

  useEffect(() => {
    const cep = formulario.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;
    let cancelada = false;
    setBuscandoCep(true);
    cepService.buscarEnderecoPorCep(cep).then((resultado) => {
      if (cancelada) return;
      if (resultado.erro) {
        toast.error("CEP não encontrado.");
        return;
      }
      setFormulario((atual) => ({
        ...atual,
        logradouro: resultado.logradouro || "",
        bairro: resultado.bairro || "",
        cidade: resultado.localidade || "",
        uf: resultado.uf || "",
      }));
    }).catch((error) => {
      if (!cancelada) console.error("Erro ao consultar CEP:", error);
    }).finally(() => {
      if (!cancelada) setBuscandoCep(false);
    });
    return () => { cancelada = true; };
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

  const confirmarFotoBiometrica = (dados) => {
    setFormulario((anterior) => ({
      ...anterior,
      foto_biometrica: dados?.imagemPreview || null,
      vetor_biometrico: dados?.vetorBiometrico || null,
      foto_biometrica_blob: dados?.imagemBlob || null,
      tamanho_foto_biometrica: dados?.tamanhoImagem || null,
    }));
    setModalBiometriaAberto(false);
  };

  const validarCamposObrigatorios = () => {
    if (etapaAtual !== 1) return true;

    if (
      !formulario.nome.trim() ||
      !formulario.email.trim() ||
      !formulario.telefone.trim()
    ) {
      toast.error("Preencha Nome, E-mail e Telefone.");
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
    if (!formulario.tipo_vinculo_id) {
      toast.error("Selecione o Tipo de Vínculo.");
      setEtapaAtual(2);
      return;
    }
    if (!publicoExterno && !valoresPadrao && !idTurma) {
      toast.error("Selecione uma turma para matricular o aluno.");
      setEtapaAtual(2);
      return;
    }

    const tipoSelecionado = tiposVinculo.find((tipo) => String(tipo.id_tipo_vinculo) === String(formulario.tipo_vinculo_id));
    const nomeVinculo = String(tipoSelecionado?.nome_vinculo || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const vinculoPermitido = valoresPadrao || (publicoExterno
      ? nomeVinculo === "publico externo"
      : ["provacionista", "membro", "membro forca viva"].includes(nomeVinculo));
    if (!vinculoPermitido) {
      toast.error(publicoExterno ? "Selecione o vínculo Público Externo." : "Selecione um vínculo elegível para aluno.");
      setEtapaAtual(2);
      return;
    }

    const cep = formulario.cep.replace(/\D/g, "");
    const enderecoIniciado = [formulario.cep, formulario.logradouro, formulario.numero, formulario.bairro, formulario.cidade, formulario.uf].some((value) => String(value || "").trim());
    const enderecoCompleto = cep.length === 8 && [formulario.logradouro, formulario.numero, formulario.bairro, formulario.cidade, formulario.uf].every((value) => String(value || "").trim());
    if (enderecoIniciado && !enderecoCompleto) {
      toast.error("Complete os campos obrigatórios do endereço ou deixe-o vazio.");
      setEtapaAtual(3);
      return;
    }
    const endereco = enderecoCompleto ? {
      cep,
      logradouro: formulario.logradouro.trim(),
      numero: formulario.numero.trim(),
      complemento: formulario.complemento.trim() || null,
      bairro: formulario.bairro.trim(),
      cidade: formulario.cidade.trim(),
      uf: formulario.uf.trim().toUpperCase(),
    } : null;

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
      ...(endereco ? { endereco } : {}),
    };

    onSalvar({
      dadosPessoa,
      idTurma: publicoExterno ? null : idTurma,
      biometria: {
        imagemBlob: formulario.foto_biometrica_blob,
        tamanhoImagem: formulario.tamanho_foto_biometrica,
        vetorBiometrico: formulario.vetor_biometrico,
      },
    });
  };

  const tituloEtapa =
    etapaAtual === 1
      ? "Dados Pessoais"
      : etapaAtual === 2
        ? "Informações Complementares"
        : "Endereço";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex min-h-0 flex-1 flex-col p-6 sm:p-8">
          <div className="-mx-6 -mt-6 mb-5 flex shrink-0 items-start justify-between border-b border-slate-700 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-800 px-6 py-5 text-white sm:-mx-8 sm:-mt-8 sm:px-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">{valoresPadrao ? "Editar cadastro" : publicoExterno ? "Nova pessoa" : "Novo aluno"}</p>
              <h2 className="mt-1 flex items-center gap-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
                {etapaAtual === 3 ? <MapPin size={22} /> : <GraduationCap size={22} />}
                {tituloEtapa}
              </h2>
              <p className="text-gray-400 text-sm font-medium">
                Etapa {etapaAtual} de {TOTAL_ETAPAS}.
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl border border-white/15 p-2 text-slate-200 transition-colors hover:bg-white/10"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mb-4 flex shrink-0 items-center gap-3">
            <div
              className={`h-1.5 flex-1 rounded-full ${etapaAtual >= 1 ? "bg-green-600" : "bg-gray-200"}`}
            />
            <div
              className={`h-1.5 flex-1 rounded-full ${etapaAtual >= 2 ? "bg-green-600" : "bg-gray-200"}`}
            />
            <div className={`h-1.5 flex-1 rounded-full ${etapaAtual >= 3 ? "bg-green-600" : "bg-gray-200"}`} />
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="custom-scrollbar grid min-h-0 flex-1 grid-cols-1 content-start gap-4 overflow-y-auto px-1 py-1 md:grid-cols-2">
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
                {!valoresPadrao && <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-green-100 p-2 text-green-700">
                        <Camera size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          Foto biométrica
                        </p>
                        <p className="text-xs text-slate-500">
                          {formulario.foto_biometrica
                            ? "Foto confirmada"
                            : "Ainda não registrada"}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      {formulario.foto_biometrica && (
                        <button
                          type="button"
                          onClick={() => {
                            setModoVisualizacaoFoto(true);
                            setModalBiometriaAberto(true);
                          }}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-100"
                        >
                          Ver foto
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setModoVisualizacaoFoto(false);
                          setModalBiometriaAberto(true);
                        }}
                        className="rounded-xl bg-green-700 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-green-800"
                      >
                        {formulario.foto_biometrica
                          ? "Refazer foto"
                          : "Registrar foto"}
                      </button>
                    </div>
                  </div>
                </div>}
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
                    <option value="">Selecione</option>
                    {tiposVinculo.filter((tipo) => {
                      if (valoresPadrao) return true;
                      const nome = String(tipo.nome_vinculo || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                      return publicoExterno ? nome === "publico externo" : ["provacionista", "membro", "membro forca viva"].includes(nome);
                    }).map((tipo) => (
                      <option key={tipo.id_tipo_vinculo} value={tipo.id_tipo_vinculo}>
                        {tipo.nome_vinculo}
                      </option>
                    ))}
                  </select>
                </div>
                {!publicoExterno && !valoresPadrao && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1" htmlFor="turma-matricula">Turma</label>
                    <select id="turma-matricula" value={idTurma} onChange={(event) => setIdTurma(event.target.value)} className={estiloInput}>
                      <option value="">Selecione a turma</option>
                      {turmas.map((turma) => <option key={turma.id_turma} value={turma.id_turma}>{turma.nome_turma}</option>)}
                    </select>
                  </div>
                )}
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
                    Bolsista
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
              </>
            )}

            {etapaAtual === 3 && (
              <>
                <div className="md:col-span-2 flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  {buscandoCep && <Loader2 size={16} className="animate-spin" />}
                  Endereço opcional. Informe o CEP para preencher os dados automaticamente.
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="cep" className="text-[10px] font-black uppercase tracking-widest text-gray-400">CEP</label>
                  <input id="cep" name="cep" value={formulario.cep} onChange={lidarComMudancaInput} maxLength={8} className={estiloInput} placeholder="00000000" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="numero" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Número</label>
                  <input id="numero" name="numero" value={formulario.numero} onChange={lidarComMudancaInput} className={estiloInput} />
                </div>
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label htmlFor="logradouro" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Logradouro</label>
                  <input id="logradouro" name="logradouro" value={formulario.logradouro} onChange={lidarComMudancaInput} className={estiloInput} />
                </div>
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label htmlFor="complemento" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Complemento</label>
                  <input id="complemento" name="complemento" value={formulario.complemento} onChange={lidarComMudancaInput} className={estiloInput} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="bairro" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Bairro</label>
                  <input id="bairro" name="bairro" value={formulario.bairro} onChange={lidarComMudancaInput} className={estiloInput} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="cidade" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cidade</label>
                  <input id="cidade" name="cidade" value={formulario.cidade} onChange={lidarComMudancaInput} className={estiloInput} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="uf" className="text-[10px] font-black uppercase tracking-widest text-gray-400">UF</label>
                  <input id="uf" name="uf" value={formulario.uf} onChange={lidarComMudancaInput} maxLength={2} className={estiloInput} />
                </div>
              </>
            )}

            </div>
            <div className="mt-4 flex shrink-0 gap-3 border-t border-slate-200 bg-white pt-4">
              <button
                type="button"
                onClick={etapaAtual === 1 ? onClose : voltar}
                className="flex-1 rounded-xl border border-slate-300 bg-white py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50"
              >
                {etapaAtual === 1 ? "Cancelar" : "Voltar"}
              </button>
              <button
                type="button"
                onClick={
                  etapaAtual < TOTAL_ETAPAS ? avancar : enviarDadosFinais
                }
                disabled={carregando || buscandoCep}
                className="flex-1 rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-800 active:scale-[0.99] disabled:cursor-wait disabled:opacity-60"
              >
                {etapaAtual < TOTAL_ETAPAS
                  ? "Próxima Etapa"
                  : carregando
                    ? "Salvando..."
                    : publicoExterno ? "Salvar Pessoa" : "Salvar Aluno"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ModalBiometriaAluno
        isOpen={modalBiometriaAberto}
        onClose={() => setModalBiometriaAberto(false)}
        onConfirmar={confirmarFotoBiometrica}
        modoVisualizacao={modoVisualizacaoFoto}
        fotoInicial={formulario.foto_biometrica}
      />
    </div>
  );
}
