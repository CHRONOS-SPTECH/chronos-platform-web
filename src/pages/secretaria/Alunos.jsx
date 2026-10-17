import { useMemo, useState } from "react";
import { BookOpen, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/homeSecretario/Header";
import ModulosControle from "../../components/turmas/ModuloControle";
import ModalAluno from "../../components/homeSecretario/ModalAluno";
import useAlunos from "../../hooks/useAlunos";
import { useToast } from "../../components/alert-toast/ToastProvider";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { formatarCPF, formatarDataBr } from "../../utils/DateUtils";

const BADGE_VINCULO = {
  Membro: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Provacionista: "bg-amber-50 text-amber-700 border-amber-200",
  "Publico Externo": "bg-slate-50 text-slate-700 border-slate-200",
  "Membro Força Viva": "bg-blue-50 text-blue-700 border-blue-200",
};

export default function Alunos() {
  const toast = useToast();
  const [modalAlunoAberto, setModalAlunoAberto] = useState(false);
  const [alunoEmEdicao, setAlunoEmEdicao] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [alunoParaExcluir, setAlunoParaExcluir] = useState(null);

  const {
    alunos,
    loading,
    error: erro,
    salvando,
    salvarAluno,
    excluirAluno,
  } = useAlunos();

  const emailJaCadastrado = (email, idAlunoIgnorado = null) => {
    const emailNormalizado = String(email || "")
      .trim()
      .toLowerCase();
    if (!emailNormalizado) return false;

    return alunos.some(
      (aluno) =>
        aluno.id_pessoa !== idAlunoIgnorado &&
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
    tipo_vinculo_id: aluno.vinculo?.id_tipo_vinculo || 2,
    data_nascimento: aluno.data_nascimento || "",
    data_ingresso: aluno.data_ingresso || "",
    data_membro: aluno.data_membro || "",
    data_saida: aluno.data_saida || "",
    id_endereco: aluno.endereco?.id || aluno.endereco?.id_endereco || null,
    cep: aluno.endereco?.cep || "",
    logradouro: aluno.endereco?.logradouro || "",
    numero: aluno.endereco?.numero || "",
    complemento: aluno.endereco?.complemento || "",
    bairro: aluno.endereco?.bairro || "",
    cidade: aluno.endereco?.cidade || "",
    uf: aluno.endereco?.uf || "",
  });

  const alunosUi = useMemo(() => {
    return alunos.map((aluno) => ({
      id: aluno.id_pessoa,
      nome: aluno.nome || "Não informado",
      email: aluno.email || "Não informado",
      cpf: formatarCPF(aluno.cpf || ""),
      dataNascimento: formatarDataBr(aluno.data_nascimento),
      vinculo: aluno.vinculo?.nome_vinculo || "Não informado",
      dataMembro: formatarDataBr(aluno.data_membro || aluno.data_ingresso),
      voluntario: Boolean(aluno.bolsista),
    }));
  }, [alunos]);

  const onSalvarAluno = async (payload) => {
    try {
      const idAluno = alunoEmEdicao?.id_pessoa || null;

      if (emailJaCadastrado(payload.dadosPessoa.email, idAluno)) {
        toast.error("Este e-mail já está cadastrado para outra pessoa.");
        return;
      }

      await salvarAluno(
        payload.dadosPessoa,
        payload.dadosEndereco,
        alunoEmEdicao,
        payload.biometria,
      );

      toast.success(
        alunoEmEdicao
          ? "Aluno atualizado com sucesso!"
          : "Aluno cadastrado com sucesso!",
      );
      fecharModalAluno();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Erro ao salvar aluno.");
    }
  };

  const onExcluirAluno = async (idPessoa, nome) => {
    setAlunoParaExcluir({ id: idPessoa, nome });
    setConfirmOpen(true);
  };

  const confirmarExclusao = async () => {
    if (!alunoParaExcluir) return setConfirmOpen(false);
    try {
      await excluirAluno(alunoParaExcluir.id);
      toast.success(`Aluno "${alunoParaExcluir.nome}" excluído.`);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir aluno.");
    } finally {
      setConfirmOpen(false);
      setAlunoParaExcluir(null);
    }
  };

  const fecharModalAluno = () => {
    setModalAlunoAberto(false);
    setAlunoEmEdicao(null);
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
            <div className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <ModulosControle moduloAtivo="Alunos" />
              <div className="flex items-center gap-4">
                <div className="hidden border-l border-slate-200 pl-4 text-right sm:block"><p className="text-2xl font-black text-slate-900">{alunosUi.length}</p><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">alunos</p></div>
                <button
                onClick={() => setModalAlunoAberto(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E7A3C] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#165a2d] active:scale-[0.98] sm:w-auto"
              >
                <Plus size={16} /> Novo Aluno
              </button>
              </div>
            </div>

            <div className="flex flex-col gap-5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                  Quadro Geral de Alunos
                </h2>
                <span className="text-xs font-bold text-slate-400">
                  {alunosUi.length} alunos cadastrados
                </span>
              </div>

              {loading && (
                <p className="text-sm text-slate-500">Carregando alunos...</p>
              )}
              {!loading && erro && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {erro}
                </div>
              )}

              <div className="relative max-h-95 overflow-y-auto overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm custom-scrollbar">
                <div className="sticky top-0 z-20 h-1 bg-[#1E7A3C]" />
                <table className="w-full border-collapse text-left table-fixed sm:table-auto">
                  <thead>
                    <tr className="border-b border-slate-700 bg-gradient-to-r from-slate-900 to-blue-950">
                      <th className="sticky top-1 z-10 bg-slate-900 p-4 text-[10px] font-black uppercase tracking-wider text-slate-100 backdrop-blur-sm">
                        Nome / Email
                      </th>
                      <th className="sticky top-1 z-10 bg-slate-900 p-4 text-[10px] font-black uppercase tracking-wider text-slate-100 backdrop-blur-sm">
                        CPF
                      </th>
                      <th className="sticky top-1 z-10 bg-slate-900 p-4 text-[10px] font-black uppercase tracking-wider text-slate-100 backdrop-blur-sm">
                        Nascimento
                      </th>
                      <th className="sticky top-1 z-10 bg-slate-900 p-4 text-[10px] font-black uppercase tracking-wider text-slate-100 backdrop-blur-sm">
                        Vínculo
                      </th>
                      <th className="sticky top-1 z-10 bg-slate-900 p-4 text-[10px] font-black uppercase tracking-wider text-slate-100 backdrop-blur-sm">
                        Data Admissão
                      </th>
                      <th className="sticky top-1 z-10 bg-slate-900 p-4 text-center text-[10px] font-black uppercase tracking-wider text-slate-100 backdrop-blur-sm">
                        Voluntário
                      </th>
                      <th className="sticky top-1 z-10 bg-slate-900 p-4 text-right text-[10px] font-black uppercase tracking-wider text-slate-100 backdrop-blur-sm">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {alunosUi.map((alunoUi, index) => (
                      <tr
                        key={alunoUi.id}
                        className="odd:bg-white even:bg-slate-50/70 hover:bg-emerald-50/50 transition-colors group"
                      >
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="flex items-center gap-3 font-bold text-sm text-slate-800 transition-colors group-hover:text-slate-950">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-black text-slate-700 ring-1 ring-slate-200">{alunoUi.nome.slice(0, 1).toUpperCase()}</span>
                              <span>{alunoUi.nome}<span className="mt-0.5 block text-xs font-medium text-slate-400">{alunoUi.email}</span></span>
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-xs font-semibold text-slate-600">
                          {alunoUi.cpf}
                        </td>
                        <td className="p-4 text-xs font-semibold text-slate-600">
                          {alunoUi.dataNascimento}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${BADGE_VINCULO[alunoUi.vinculo] || "bg-slate-50 text-slate-600 border-slate-200"}`}
                          >
                            {alunoUi.vinculo}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-semibold text-slate-600">
                          {alunoUi.dataMembro}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center">
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${alunoUi.voluntario ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-slate-300"}`}
                            />
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1.5 justify-end">
                            <button aria-label={`Visualizar ${alunoUi.nome}`} className="p-2 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all shadow-sm">
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => {
                                setAlunoEmEdicao(alunos[index]);
                                setModalAlunoAberto(true);
                              }}
                              aria-label={`Editar ${alunoUi.nome}`}
                              className="p-2 border border-slate-200 text-slate-400 hover:border-blue-200 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all shadow-sm"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() =>
                                onExcluirAluno(alunoUi.id, alunoUi.nome)
                              }
                              aria-label={`Excluir ${alunoUi.nome}`}
                              className="p-2 border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      <ModalAluno
        isOpen={modalAlunoAberto}
        onClose={fecharModalAluno}
        onSalvar={onSalvarAluno}
        carregando={salvando}
        valoresPadrao={
          alunoEmEdicao ? mapAlunoParaForm(alunoEmEdicao) : undefined
        }
      />
      <ConfirmDialog
        aberto={confirmOpen}
        titulo="Confirmar Exclusão"
        mensagem={`Deseja excluir o aluno "${alunoParaExcluir?.nome}"?`}
        onConfirm={confirmarExclusao}
        onCancel={() => setConfirmOpen(false)}
        variant="danger"
        confirmText="Excluir aluno"
      />
    </div>
  );
}
