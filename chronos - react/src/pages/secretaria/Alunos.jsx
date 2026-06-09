import { useEffect, useMemo, useState } from "react";
import { BookOpen, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/homeSecretario/Header";
import ModulosControle from "../../components/turmas/ModuloControle";
import ModalAluno from "../../components/homeSecretario/ModalAluno";
import alunoService from "../../services/alunoService";
import { formatarCPF, formatarDataBr } from "../../utils/DateUtils";

const BADGE_VINCULO = {
  Membro: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Provacionista: "bg-amber-50 text-amber-700 border-amber-200",
  "Publico Externo": "bg-slate-50 text-slate-700 border-slate-200",
  "Membro Força Viva": "bg-blue-50 text-blue-700 border-blue-200",
};

export default function Alunos() {
  const [modalAlunoAberto, setModalAlunoAberto] = useState(false);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [salvandoAluno, setSalvandoAluno] = useState(false);
  const [alunoEmEdicao, setAlunoEmEdicao] = useState(null);

  const carregarAlunos = async () => {
    try {
      setLoading(true);
      setErro("");
      const dados = await alunoService.listarAlunos();
      setAlunos(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error(error);
      setErro(
        error?.response?.data?.message ||
          "Não foi possível carregar os alunos.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAlunos();
  }, []);

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
  });

  const alunosUi = useMemo(() => {
    console.log("Mapeando alunos para UI:", alunos);
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

  const onSalvarAluno = async (dadosAluno) => {
    try {
      setSalvandoAluno(true);
      const { endereco, ...dadosPessoa } = dadosAluno;
      const idAluno = alunoEmEdicao?.id_pessoa || null;

      if (emailJaCadastrado(dadosPessoa.email, idAluno)) {
        window.alert("Este e-mail já está cadastrado para outra pessoa.");
        return;
      }

      if (alunoEmEdicao) {
        const alunoAtualizado = await alunoService.atualizarAluno(
          idAluno,
          dadosPessoa,
        );
        setAlunos((ant) =>
          ant.map((item) =>
            item.id_pessoa === idAluno ? { ...item, ...alunoAtualizado } : item,
          ),
        );
        window.alert(`Aluno atualizado com sucesso!`);
      } else {
        const alunoCriado = await alunoService.cadastrarAluno(dadosPessoa);
        setAlunos((ant) => [alunoCriado, ...ant]);
      }

      fecharModalAluno();
    } catch (error) {
      console.error(error);
      window.alert(error?.response?.data?.message || "Erro ao salvar aluno.");
    } finally {
      setSalvandoAluno(false);
    }
  };

  const onExcluirAluno = async (idPessoa, nome) => {
    if (!window.confirm(`Deseja excluir o aluno "${nome}"?`)) return;
    try {
      await alunoService.excluirAluno(idPessoa);
      setAlunos((ant) => ant.filter((item) => item.id_pessoa !== idPessoa));
    } catch (error) {
      console.error(error);
      window.alert("Erro ao excluir aluno.");
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
          <div className="max-w-[1500px] mx-auto p-8 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-6">
              <ModulosControle moduloAtivo="Alunos" />
              <button
                onClick={() => setModalAlunoAberto(true)}
                className="flex items-center gap-2 bg-[#1E7A3C] hover:bg-[#165a2d] text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-2xl transition-all shadow-md active:scale-[0.98]"
              >
                <Plus size={16} /> Novo Aluno
              </button>
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

              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden max-h-[380px] overflow-y-auto custom-scrollbar relative">
                <table className="w-full border-collapse text-left table-fixed sm:table-auto">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="sticky top-0 z-10 p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/90 backdrop-blur-sm">
                        Nome / Email
                      </th>
                      <th className="sticky top-0 z-10 p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/90 backdrop-blur-sm">
                        CPF
                      </th>
                      <th className="sticky top-0 z-10 p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/90 backdrop-blur-sm">
                        Nascimento
                      </th>
                      <th className="sticky top-0 z-10 p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/90 backdrop-blur-sm">
                        Vínculo
                      </th>
                      <th className="sticky top-0 z-10 p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/90 backdrop-blur-sm">
                        Data Admissão
                      </th>
                      <th className="sticky top-0 z-10 p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center bg-slate-50/90 backdrop-blur-sm">
                        Voluntário
                      </th>
                      <th className="sticky top-0 z-10 p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right bg-slate-50/90 backdrop-blur-sm">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {alunosUi.map((alunoUi, index) => (
                      <tr
                        key={alunoUi.id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-slate-800 group-hover:text-[#1E7A3C] transition-colors">
                              {alunoUi.nome}
                            </span>
                            <span className="text-xs text-slate-400 font-medium mt-0.5">
                              {alunoUi.email}
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
                            <button className="p-2 border border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all shadow-sm">
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => {
                                setAlunoEmEdicao(alunos[index]);
                                setModalAlunoAberto(true);
                              }}
                              className="p-2 border border-slate-100 text-slate-400 hover:text-[#1E7A3C] hover:bg-green-50/50 rounded-xl transition-all shadow-sm"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() =>
                                onExcluirAluno(alunoUi.id, alunoUi.nome)
                              }
                              className="p-2 border border-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50/50 rounded-xl transition-all shadow-sm"
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
        carregando={salvandoAluno}
        valoresPadrao={
          alunoEmEdicao ? mapAlunoParaForm(alunoEmEdicao) : undefined
        }
      />
    </div>
  );
}
