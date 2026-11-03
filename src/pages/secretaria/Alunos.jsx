import { useEffect, useMemo, useState } from "react";
import BookOpen from "lucide-react/icons/book-open";
import Plus from "lucide-react/icons/plus";
import Search from "lucide-react/icons/search";
import LoaderCircle from "lucide-react/icons/loader-circle";
import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/homeSecretario/Header";
import ModulosControle from "../../components/turmas/ModuloControle";
import ModalAluno from "../../components/homeSecretario/ModalAluno";
import useAlunos from "../../hooks/useAlunos";
import { useToast } from "../../components/alert-toast/ToastProvider";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { formatarDataBr } from "../../utils/DateUtils";
import pessoaService from "../../services/pessoaService";
import PessoaDetalhesModal from "../../components/pessoas/PessoaDetalhesModal";
import ModalBiometriaAluno from "../../components/reconhecimento-facial/ModalBiometriaAluno";
import { AlunosTable, PublicoExternoTable } from "../../components/pessoas/AlunosTable";

export default function Alunos() {
  const toast = useToast();
  const [modalAlunoAberto, setModalAlunoAberto] = useState(false);
  const [alunoEmEdicao, setAlunoEmEdicao] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [alunoParaExcluir, setAlunoParaExcluir] = useState(null);
  const [publicoExterno, setPublicoExterno] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  const [pessoaDetalhada, setPessoaDetalhada] = useState(null);
  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);
  const [pessoaParaBiometria, setPessoaParaBiometria] = useState(null);
  const [salvandoBiometria, setSalvandoBiometria] = useState(false);

  const {
    alunos,
    pagina,
    setPagina,
    tamanhoPagina,
    definirTamanhoPagina,
    paginacao,
    loading,
    error: erro,
    salvando,
    salvarAluno,
    inativarPessoa,
    atualizarBiometria,
  } = useAlunos({ publicoExterno });

  const emailJaCadastrado = (email, idAlunoIgnorado = null) => {
    const emailNormalizado = String(email || "")
      .trim()
      .toLowerCase();
    if (!emailNormalizado) return false;

    return alunos.some(
      (aluno) =>
        String(aluno.id_pessoa) !== String(idAlunoIgnorado) &&
        String(aluno.email).trim().toLowerCase() === emailNormalizado,
    );
  };

  const mapAlunoParaForm = (aluno) => ({
    nome: aluno.nome || "",
    email: aluno.email || "",
    telefone: aluno.telefone || "",
    genero: aluno.genero || "",
    cpf: aluno.cpf || "",
    bolsista: Boolean(aluno.bolsista),
    url_foto_perfil: aluno.url_foto_perfil || "",
    foto_biometrica: aluno.url_foto_perfil || null,
    tipo_vinculo_id: aluno.tipo_vinculo_id || aluno.vinculo?.id_tipo_vinculo || "",
    data_nascimento: aluno.data_nascimento || "",
    data_ingresso: aluno.data_ingresso || "",
    data_membro: aluno.data_membro || "",
    cep: aluno.endereco?.cep || "",
    logradouro: aluno.endereco?.logradouro || "",
    numero: aluno.endereco?.numero || "",
    complemento: aluno.endereco?.complemento || "",
    bairro: aluno.endereco?.bairro || "",
    cidade: aluno.endereco?.cidade || "",
    uf: aluno.endereco?.uf || "",
  });
  const valoresPadraoModal = useMemo(
    () => (alunoEmEdicao ? mapAlunoParaForm(alunoEmEdicao) : undefined),
    [alunoEmEdicao],
  );

  const alunosUi = useMemo(() => {
    const termo = termoBusca.trim().toLocaleLowerCase("pt-BR");
    return alunos.map((aluno) => ({
      id: aluno.id_pessoa,
      nome: aluno.nome || "Não informado",
      email: aluno.email || "Não informado",
      telefone: aluno.telefone || "Não informado",
      cpf: aluno.cpf || "Não informado",
      dataNascimento: formatarDataBr(aluno.data_nascimento),
      dataIngresso: formatarDataBr(aluno.data_ingresso),
      dataMembro: formatarDataBr(aluno.data_membro),
      dataSaida: formatarDataBr(aluno.data_saida),
      vinculo: aluno.tipo_vinculo_nome || "Não informado",
      tipoVinculoId: aluno.tipo_vinculo_id,
      tipoVinculoNome: aluno.tipo_vinculo_nome || "Não informado",
      bolsista: aluno.bolsista,
      percentualPresenca: aluno.percentual_presenca ?? null,
      turmasAtuais: Array.isArray(aluno.turmas_atuais) ? aluno.turmas_atuais : [],
      raw: aluno,
      pessoa: aluno,
    })).filter(({ nome, email, telefone, cpf, vinculo }) =>
      !termo || [nome, email, telefone, cpf, vinculo].some((valor) => String(valor).toLocaleLowerCase("pt-BR").includes(termo)),
    );
  }, [alunos, termoBusca]);

  const abrirEdicao = async (pessoa) => {
    try {
      const dadosCompletos = await pessoaService.buscarPessoaDetalhada(pessoa.id_pessoa);
      setAlunoEmEdicao(dadosCompletos);
      setModalAlunoAberto(true);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível carregar os dados para edição.");
    }
  };

  const abrirDetalhes = async (pessoa) => {
    setCarregandoDetalhes(true);
    try {
      setPessoaDetalhada(await pessoaService.buscarPessoaDetalhada(pessoa.id_pessoa));
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível carregar os detalhes da pessoa.");
    } finally {
      setCarregandoDetalhes(false);
    }
  };

  const onSalvarAluno = async (payload) => {
    try {
      const idAluno = alunoEmEdicao?.id_pessoa || null;

      if (emailJaCadastrado(payload.dadosPessoa.email, idAluno)) {
        toast.error("Este e-mail já está cadastrado para outra pessoa.");
        return;
      }

      await salvarAluno(
        payload.dadosPessoa,
        alunoEmEdicao,
        payload.biometria,
        payload.idTurma,
      );

      toast.success(alunoEmEdicao ? "Cadastro atualizado com sucesso!" : publicoExterno ? "Pessoa cadastrada com sucesso!" : "Aluno cadastrado e matriculado com sucesso!");
      fecharModalAluno();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message || "Erro ao salvar o cadastro.");
    }
  };

  const solicitarInativacao = (idPessoa, nome) => {
    setAlunoParaExcluir({ id: idPessoa, nome });
    setConfirmOpen(true);
  };

  const confirmarInativacao = async () => {
    if (!alunoParaExcluir) return setConfirmOpen(false);
    try {
      await inativarPessoa(alunoParaExcluir.id);
      toast.success(`Pessoa "${alunoParaExcluir.nome}" inativada.`);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao inativar pessoa.");
    } finally {
      setConfirmOpen(false);
      setAlunoParaExcluir(null);
    }
  };

  const fecharModalAluno = () => {
    setModalAlunoAberto(false);
    setAlunoEmEdicao(null);
  };

  const salvarBiometria = async (captura) => {
    if (!pessoaParaBiometria) return;
    setSalvandoBiometria(true);
    try {
      await atualizarBiometria(pessoaParaBiometria.id_pessoa, captura);
      toast.success("Biometria atualizada com sucesso.");
      setPessoaParaBiometria(null);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Não foi possível atualizar a biometria.");
      throw error;
    } finally {
      setSalvandoBiometria(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans antialiased">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          titulo="Gestão Acadêmica"
          icone={BookOpen}
          usuario={{ nome: "Henrique", cargo: "Secretário" }}
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="mx-auto flex max-w-375 flex-col gap-6 p-4 sm:p-8">
            <div className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <ModulosControle moduloAtivo="Alunos" />
              <div className="flex items-center gap-4">
                <div className="hidden border-l border-slate-200 pl-4 text-right sm:block">
                  <p className="text-2xl font-black text-slate-900">
                    {paginacao.totalElements}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {publicoExterno ? "pessoas" : "alunos"}
                  </p>
                </div>
                <button
                  onClick={() => setModalAlunoAberto(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E7A3C] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#165a2d] active:scale-[0.98] sm:w-auto"
                >
                  <Plus size={16} /> {publicoExterno ? "Nova Pessoa" : "Novo Aluno"}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-5 animate-in fade-in duration-300">
              <div className="flex flex-col gap-1 px-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-800">
                    {publicoExterno ? "Público Externo" : "Alunos matriculados"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {publicoExterno ? "Pessoas ativas com vínculo de Público Externo." : "Pessoas ativas com vínculo elegível e matrícula em turma."}
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {paginacao.totalElements} {publicoExterno ? "pessoas" : "alunos"} cadastrados
                </span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 sm:max-w-xl">
                  <Search size={18} className="shrink-0 text-slate-400" aria-hidden="true" />
                  <input value={termoBusca} onChange={(event) => setTermoBusca(event.target.value)} placeholder={`Buscar ${publicoExterno ? "pessoa" : "aluno"} por nome, e-mail, CPF ou vínculo`} aria-label={`Buscar ${publicoExterno ? "pessoa" : "aluno"}`} className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" />
                </label>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <span className="text-xs font-bold text-slate-500">Exibir na tabela:</span>
                  <div className="flex w-fit shrink-0 items-center gap-1 rounded-xl border border-slate-200 bg-white p-1" role="tablist" aria-label="Conteúdo exibido na tabela">
                  {[{ label: "Alunos", active: false }, { label: "Público Externo", active: true }].map((tab) => (
                    <button key={tab.label} type="button" role="tab" aria-selected={publicoExterno === tab.active} aria-controls="people-records-table" onClick={() => { setPublicoExterno(tab.active); setPagina(0); setTermoBusca(""); }} className={`rounded-lg px-3 py-2 text-xs font-bold transition-all ${publicoExterno === tab.active ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}>
                      {tab.label}
                    </button>
                  ))}
                  </div>
                </div>
              </div>

              {loading && (
                <div
                  role="status"
                  aria-live="polite"
                  aria-busy="true"
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="h-1 bg-emerald-700" />
                  <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
                    <LoaderCircle
                      size={20}
                      className="shrink-0 animate-spin text-emerald-700"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Carregando dados dos alunos
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Aguarde enquanto buscamos os cadastros.
                      </p>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-100 px-5 sm:px-6">
                    {Array.from({ length: 5 }, (_, index) => (
                      <div
                        key={index}
                        className="flex h-[68px] animate-pulse items-center gap-4"
                      >
                        <span className="size-9 shrink-0 rounded-xl bg-slate-100" />
                        <div className="min-w-0 flex-1 space-y-2">
                          <span className="block h-3 w-36 max-w-full rounded bg-slate-200" />
                          <span className="block h-2.5 w-48 max-w-full rounded bg-slate-100" />
                        </div>
                        <span className="hidden h-3 w-20 rounded bg-slate-100 sm:block" />
                        <span className="hidden h-3 w-24 rounded bg-slate-100 md:block" />
                        <span className="hidden h-6 w-16 rounded-full bg-slate-100 lg:block" />
                        <span className="h-8 w-16 rounded-lg bg-slate-100" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!loading && erro && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {erro}
                </div>
              )}

              {!loading && !erro && (
              <div id="people-records-table" role="tabpanel" className="max-h-[68vh] overflow-auto rounded-3xl border border-slate-200 bg-white shadow-sm custom-scrollbar">
                  {publicoExterno ? (
                    <PublicoExternoTable pessoas={alunosUi} mensagemVazia={termoBusca ? "Nenhum resultado nesta página." : "Nenhuma pessoa de Público Externo cadastrada."} onDetalhes={abrirDetalhes} onEditar={abrirEdicao} onInativar={solicitarInativacao} />
                  ) : (
                    <AlunosTable alunos={alunosUi} mensagemVazia={termoBusca ? "Nenhum resultado nesta página." : "Nenhum aluno nesta lista. Para aparecer aqui, a pessoa precisa estar ativa, ter vínculo elegível e possuir matrícula em uma turma."} onDetalhes={abrirDetalhes} onEditar={abrirEdicao} onBiometria={setPessoaParaBiometria} onInativar={solicitarInativacao} />
                  )}
                </div>
              )}
              {!loading && !erro && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
                  <span>Exibindo {alunosUi.length} de {paginacao.totalElements} {publicoExterno ? "pessoas" : "alunos"}</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2">Por página
                      <select value={tamanhoPagina} onChange={(event) => definirTamanhoPagina(Number(event.target.value))} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5">
                        {[10, 20, 50].map((tamanho) => <option key={tamanho} value={tamanho}>{tamanho}</option>)}
                      </select>
                    </label>
                    <button type="button" disabled={pagina === 0 || loading} onClick={() => setPagina(pagina - 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40">Anterior</button>
                    <span>Página {(paginacao.number ?? pagina) + 1} de {Math.max(1, paginacao.totalPages)}</span>
                    <button type="button" disabled={paginacao.last || loading} onClick={() => setPagina(pagina + 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40">Próxima</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <PessoaDetalhesModal pessoa={pessoaDetalhada} carregando={carregandoDetalhes} onClose={() => setPessoaDetalhada(null)} />

      <ModalBiometriaAluno
        isOpen={Boolean(pessoaParaBiometria)}
        onClose={() => { if (!salvandoBiometria) setPessoaParaBiometria(null); }}
        onConfirmar={salvarBiometria}
        carregando={salvandoBiometria}
      />

      <ModalAluno
        isOpen={modalAlunoAberto}
        publicoExterno={publicoExterno}
        onClose={fecharModalAluno}
        onSalvar={onSalvarAluno}
        carregando={salvando}
        valoresPadrao={valoresPadraoModal}
      />
      <ConfirmDialog
        aberto={confirmOpen}
        titulo="Confirmar inativação"
        mensagem={`Deseja inativar "${alunoParaExcluir?.nome}"? O histórico será preservado.`}
        onConfirm={confirmarInativacao}
        onCancel={() => setConfirmOpen(false)}
        variant="danger"
        confirmText="Inativar"
      />
    </div>
  );
}
