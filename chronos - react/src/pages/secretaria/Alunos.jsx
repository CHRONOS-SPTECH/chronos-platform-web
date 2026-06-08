import { useEffect, useMemo, useState } from "react";
import { BookOpen, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/homeSecretario/Header";
import ModulosControle from "../../components/turmas/ModuloControle";
import ModalAluno from "../../components/homeSecretario/ModalAluno";
import alunoService from "../../services/alunoService";
import api from "../../services/api";
import { formatarCPF, formatarDataBr } from "../../utils/DateUtils";

const getApiField = (obj, ...keys) => {
  for (const key of keys) {
    if (obj?.[key] !== undefined && obj?.[key] !== null) return obj[key];
  }
  return null;
};

const VINCULO_LABEL_POR_ID = {
  1: "Publico Externo",
  2: "Provacionista",
  3: "Membro",
  4: "Membro Forca Viva",
};

const IDS_VINCULO_ALUNO = new Set(
  Object.keys(VINCULO_LABEL_POR_ID).map(Number),
);

const getPessoaId = (obj) =>
  Number(
    getApiField(obj, "id_pessoa", "idPessoa", "pessoa_id", "pessoaId", "id"),
  );

const mapUsuariosParaIdsPessoa = (usuarios) => {
  if (!Array.isArray(usuarios)) return new Set();

  return new Set(
    usuarios
      .map((usuario) => getPessoaId(getApiField(usuario, "pessoa") || usuario))
      .filter((id) => Number.isFinite(id) && id > 0),
  );
};

const ehAluno = (pessoa, idsPessoaUsuarioArg) => {
  const idsPessoaUsuario =
    idsPessoaUsuarioArg instanceof Set ? idsPessoaUsuarioArg : new Set();

  const idPessoa = getPessoaId(pessoa);
  if (idsPessoaUsuario.has(idPessoa)) return false;

  const idVinculo = Number(
    getApiField(pessoa, "tipo_vinculo_id", "tipoVinculoId"),
  );
  const possuiVinculoAluno = IDS_VINCULO_ALUNO.has(idVinculo);

  const possuiPerfilAcesso =
    Array.isArray(getApiField(pessoa, "perfis_id", "perfisId")) ||
    Array.isArray(getApiField(pessoa, "perfis")) ||
    Boolean(
      getApiField(
        pessoa,
        "usuario_id",
        "usuarioId",
        "email_login",
        "emailLogin",
      ),
    );

  return possuiVinculoAluno && !possuiPerfilAcesso;
};

const extrairMensagemErro = (error, padrao) => {
  const mensagem =
    error?.response?.data?.message ||
    error?.response?.data?.erro ||
    error?.response?.data?.error ||
    error?.message;

  return mensagem ? `${padrao} ${mensagem}` : padrao;
};

const mapAlunoApiParaUi = (aluno) => {
  const idVinculo = Number(
    getApiField(aluno, "tipo_vinculo_id", "tipoVinculoId"),
  );
  const nomeVinculo =
    getApiField(aluno, "nome_vinculo", "nomeVinculo") ||
    VINCULO_LABEL_POR_ID[idVinculo] ||
    "Nao informado";

  return {
    id: getApiField(aluno, "id_pessoa", "idPessoa", "id"),
    nome: getApiField(aluno, "nome") || "Nao informado",
    email: getApiField(aluno, "email") || "Nao informado",
    cpf: formatarCPF(getApiField(aluno, "cpf") || ""),
    dataNascimento: formatarDataBr(
      getApiField(aluno, "data_nascimento", "dataNascimento"),
    ),
    vinculo: nomeVinculo,
    dataMembro: formatarDataBr(
      getApiField(
        aluno,
        "data_membro",
        "dataMembro",
        "data_ingresso",
        "dataIngresso",
      ),
    ),
    voluntario: Boolean(getApiField(aluno, "bolsista", "voluntario")),
  };
};

const BADGE_VINCOLO = {
  Membro: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Provacionista: "bg-amber-50 text-amber-700 border-amber-200",
  "Publico Externo": "bg-slate-50 text-slate-700 border-slate-200",
  "Membro Forca Viva": "bg-blue-50 text-blue-700 border-blue-200",
};

export default function Alunos() {
  const [modalAlunoAberto, setModalAlunoAberto] = useState(false);
  const [alunos, setAlunos] = useState([]);
  const [pessoasCadastradas, setPessoasCadastradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [salvandoAluno, setSalvandoAluno] = useState(false);
  const [alunoEmEdicao, setAlunoEmEdicao] = useState(null);

  const normalizarEmail = (valor) =>
    String(valor || "")
      .trim()
      .toLowerCase();

  const emailJaCadastrado = (email, idPessoaIgnorado = null) => {
    const emailNormalizado = normalizarEmail(email);
    if (!emailNormalizado) return false;

    return pessoasCadastradas.some((pessoa) => {
      const idPessoa = getApiField(pessoa, "id_pessoa", "idPessoa", "id");
      const emailPessoa = normalizarEmail(getApiField(pessoa, "email"));
      const mesmoRegistro = Number(idPessoa) === Number(idPessoaIgnorado);

      return !mesmoRegistro && emailPessoa === emailNormalizado;
    });
  };

  const carregarAlunos = async () => {
    try {
      setLoading(true);
      setErro("");

      const [dadosPessoas, dadosUsuarios] = await Promise.all([
        alunoService.listarAlunos(),
        api.get("/usuarios"),
      ]);

      const usuarios = Array.isArray(dadosUsuarios?.data)
        ? dadosUsuarios.data
        : [];
      const idsPessoaUsuario = mapUsuariosParaIdsPessoa(usuarios);
      const lista = Array.isArray(dadosPessoas) ? dadosPessoas : [];
      setPessoasCadastradas(lista);
      setAlunos(lista.filter((pessoa) => ehAluno(pessoa, idsPessoaUsuario)));
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      setErro(
        extrairMensagemErro(error, "Nao foi possivel carregar os alunos."),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAlunos();
  }, []);

  const abrirModalAluno = () => {
    setAlunoEmEdicao(null);
    setModalAlunoAberto(true);
  };

  const fecharModalAluno = () => {
    setModalAlunoAberto(false);
    setAlunoEmEdicao(null);
  };

  const mapAlunoApiParaForm = (aluno) => ({
    nome: getApiField(aluno, "nome") || "",
    email: getApiField(aluno, "email") || "",
    telefone: getApiField(aluno, "telefone") || "",
    genero: getApiField(aluno, "genero") || "",
    cpf: getApiField(aluno, "cpf") || "",
    bolsista: Boolean(getApiField(aluno, "bolsista", "voluntario")),
    url_foto_perfil:
      getApiField(aluno, "url_foto_perfil", "urlFotoPerfil") || "",
    tipo_vinculo_id: Number(
      getApiField(aluno, "tipo_vinculo_id", "tipoVinculoId") || 2,
    ),
    data_nascimento:
      getApiField(aluno, "data_nascimento", "dataNascimento") || "",
    data_ingresso: getApiField(aluno, "data_ingresso", "dataIngresso") || "",
    data_membro: getApiField(aluno, "data_membro", "dataMembro") || "",
    data_saida: getApiField(aluno, "data_saida", "dataSaida") || "",
  });

  const onSalvarAluno = async (dadosAluno) => {
    try {
      setSalvandoAluno(true);
      const { endereco, ...dadosPessoa } = dadosAluno;

      if (alunoEmEdicao) {
        const idAluno = getApiField(
          alunoEmEdicao,
          "id_pessoa",
          "idPessoa",
          "id",
        );
        if (emailJaCadastrado(dadosPessoa.email, idAluno)) {
          window.alert("Este e-mail ja esta cadastrado para outra pessoa.");
          return;
        }

        const alunoAtualizado = await alunoService.atualizarAluno(
          idAluno,
          dadosPessoa,
        );

        setPessoasCadastradas((anterior) =>
          anterior.map((pessoa) => {
            const idPessoa = getApiField(pessoa, "id_pessoa", "idPessoa", "id");
            return Number(idPessoa) === Number(idAluno)
              ? alunoAtualizado
              : pessoa;
          }),
        );

        setAlunos((anterior) =>
          anterior
            .map((item) => {
              const idItem = getApiField(item, "id_pessoa", "idPessoa", "id");
              return Number(idItem) === Number(idAluno)
                ? alunoAtualizado
                : item;
            })
            .filter((pessoa) => ehAluno(pessoa)),
        );

        const nomeAtualizado =
          getApiField(alunoAtualizado, "nome") || dadosPessoa.nome || "";
        window.alert(`Aluno ${nomeAtualizado} atualizado com sucesso`);
      } else {
        if (emailJaCadastrado(dadosPessoa.email)) {
          window.alert("Este e-mail ja esta cadastrado para outra pessoa.");
          return;
        }

        const alunoCriado = await alunoService.cadastrarAluno(dadosPessoa);
        setPessoasCadastradas((anterior) => [alunoCriado, ...anterior]);
        setAlunos((anterior) =>
          [alunoCriado, ...anterior].filter((pessoa) => ehAluno(pessoa)),
        );
      }

      setModalAlunoAberto(false);
      setAlunoEmEdicao(null);
      setErro("");
    } catch (error) {
      console.error("Erro ao salvar aluno:", error);
      window.alert(extrairMensagemErro(error, "Erro ao salvar aluno."));
    } finally {
      setSalvandoAluno(false);
    }
  };

  const onEditarAluno = (aluno) => {
    setAlunoEmEdicao(aluno);
    setModalAlunoAberto(true);
  };

  const onExcluirAluno = async (aluno) => {
    const nomeAluno = getApiField(aluno, "nome") || "este aluno";
    const confirmou = window.confirm(`Deseja excluir o aluno "${nomeAluno}"?`);
    if (!confirmou) return;

    try {
      const idAluno = getApiField(aluno, "id_pessoa", "idPessoa", "id");
      await alunoService.excluirAluno(idAluno);
      setAlunos((anterior) =>
        anterior.filter((item) => {
          const idItem = getApiField(item, "id_pessoa", "idPessoa", "id");
          return Number(idItem) !== Number(idAluno);
        }),
      );
      setErro("");
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
      window.alert(extrairMensagemErro(error, "Erro ao excluir aluno."));
    }
  };

  const alunosUi = useMemo(() => alunos.map(mapAlunoApiParaUi), [alunos]);

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
                onClick={abrirModalAluno}
                className="flex items-center gap-2 bg-[#1E7A3C] hover:bg-[#165a2d] text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-2xl transition-all shadow-md shadow-green-100/50 active:scale-[0.98]"
              >
                <Plus size={16} />
                Novo Aluno
              </button>
            </div>

            {/* Quadro Geral de Alunos */}
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
                    {alunos.map((aluno) => {
                      const alunoUi = mapAlunoApiParaUi(aluno);

                      return (
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
                              className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${BADGE_VINCOLO[alunoUi.vinculo] || "bg-slate-50 text-slate-600 border-slate-200"}`}
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
                                onClick={() => onEditarAluno(aluno)}
                                className="p-2 border border-slate-100 text-slate-400 hover:text-[#1E7A3C] hover:bg-green-50/50 rounded-xl transition-all shadow-sm"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => onExcluirAluno(aluno)}
                                className="p-2 border border-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50/50 rounded-xl transition-all shadow-sm"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
          alunoEmEdicao ? mapAlunoApiParaForm(alunoEmEdicao) : undefined
        }
      />
    </div>
  );
}
