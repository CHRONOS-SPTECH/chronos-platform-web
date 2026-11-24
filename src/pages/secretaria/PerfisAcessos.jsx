import { useState } from "react";
import ShieldCheck from "lucide-react/icons/shield-check";
import UserCog from "lucide-react/icons/user-cog";
import GraduationCap from "lucide-react/icons/graduation-cap";
import ClipboardList from "lucide-react/icons/clipboard-list";
import Check from "lucide-react/icons/check";
import X from "lucide-react/icons/x";
import Info from "lucide-react/icons/info";
import LayoutGrid from "lucide-react/icons/layout-grid";
import Plus from "lucide-react/icons/plus";
import Pencil from "lucide-react/icons/pencil";
import Trash2 from "lucide-react/icons/trash-2";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useToast } from "../../components/feedback/ToastProvider";

const PERFIS_INICIAIS = [
  {
    id: "administrador",
    nome: "Administrador",
    descricao: "Acesso de administração e visão geral da plataforma.",
    icon: UserCog,
    cor: "blue",
    telas: [
      "painel",
      "panorama-academico",
      "engajamento",
      "alunos",
      "turmas",
      "eventos",
      "cronograma",
      "gestao-aulas",
      "chamada",
      "agenda",
      "usuarios",
      "perfis-acessos",
    ],
  },
  {
    id: "instrutor",
    nome: "Instrutor",
    descricao: "Rotinas de acompanhamento de aulas e presença.",
    icon: GraduationCap,
    cor: "emerald",
    telas: ["painel", "cronograma", "chamada", "agenda"],
  },
  {
    id: "secretario",
    nome: "Secretário",
    descricao: "Gestão operacional e cadastros acadêmicos.",
    icon: ClipboardList,
    cor: "amber",
    telas: [
      "painel",
      "panorama-academico",
      "engajamento",
      "alunos",
      "turmas",
      "eventos",
      "cronograma",
      "gestao-aulas",
    ],
  },
];

const GRUPOS_TELAS = [
  {
    grupo: "Visão geral",
    telas: [
      { id: "painel", nome: "Painel do perfil" },
      { id: "panorama-academico", nome: "Panorama acadêmico" },
      { id: "engajamento", nome: "Engajamento das atividades" },
    ],
  },
  {
    grupo: "Gestão acadêmica",
    telas: [
      { id: "alunos", nome: "Alunos" },
      { id: "turmas", nome: "Turmas" },
      { id: "eventos", nome: "Eventos" },
      { id: "cronograma", nome: "Cronograma de aulas" },
      { id: "gestao-aulas", nome: "Gestão de aulas" },
      { id: "chamada", nome: "Chamada do dia" },
      { id: "agenda", nome: "Minha agenda" },
    ],
  },
  {
    grupo: "Administração",
    telas: [
      { id: "usuarios", nome: "Usuários" },
      { id: "perfis-acessos", nome: "Perfis e acessos" },
    ],
  },
];

const coresPerfil = {
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
};

function PerfisAcessos() {
  const toast = useToast();
  const [perfis, setPerfis] = useState(PERFIS_INICIAIS);
  const [perfilEmEdicao, setPerfilEmEdicao] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [perfilParaExcluir, setPerfilParaExcluir] = useState(null);
  const [erroFormulario, setErroFormulario] = useState("");
  const [formulario, setFormulario] = useState({ nome: "", descricao: "", telas: [] });
  const totalTelas = GRUPOS_TELAS.reduce((total, grupo) => total + grupo.telas.length, 0);

  const abrirNovoPerfil = () => {
    setPerfilEmEdicao(null);
    setErroFormulario("");
    setFormulario({ nome: "", descricao: "", telas: [] });
    setModalAberto(true);
  };

  const abrirEdicaoPerfil = (perfil) => {
    setPerfilEmEdicao(perfil);
    setErroFormulario("");
    setFormulario({
      nome: perfil.nome,
      descricao: perfil.descricao,
      telas: [...perfil.telas],
    });
    setModalAberto(true);
  };

  const salvarPerfil = (event) => {
    event.preventDefault();
    const nome = formulario.nome.trim();
    if (!nome) {
      setErroFormulario("Informe um nome para o perfil.");
      return;
    }

    const nomeEmUso = perfis.some(
      (perfil) =>
        perfil.id !== perfilEmEdicao?.id &&
        perfil.nome.trim().toLocaleLowerCase("pt-BR") ===
          nome.toLocaleLowerCase("pt-BR"),
    );
    if (nomeEmUso) {
      setErroFormulario("Já existe um perfil com esse nome.");
      return;
    }

    if (perfilEmEdicao) {
      setPerfis((atuais) =>
        atuais.map((perfil) =>
          perfil.id === perfilEmEdicao.id
            ? { ...perfil, nome, descricao: formulario.descricao.trim(), telas: formulario.telas }
            : perfil,
        ),
      );
      toast.success(`Perfil "${nome}" atualizado com sucesso!`);
    } else {
      setPerfis((atuais) => [
        ...atuais,
        {
          id: `perfil-${Date.now()}`,
          nome,
          descricao: formulario.descricao.trim(),
          icon: ShieldCheck,
          cor: "slate",
          telas: formulario.telas,
        },
      ]);
      toast.success(`Perfil "${nome}" criado com sucesso!`);
    }
    setModalAberto(false);
  };

  const confirmarExclusaoPerfil = () => {
    if (!perfilParaExcluir) return;
    setPerfis((atuais) =>
      atuais.filter((perfil) => perfil.id !== perfilParaExcluir.id),
    );
    toast.success(`Perfil "${perfilParaExcluir.nome}" excluído com sucesso!`);
    setPerfilParaExcluir(null);
  };

  const alternarTela = (idTela) => {
    setFormulario((atual) => ({
      ...atual,
      telas: atual.telas.includes(idTela)
        ? atual.telas.filter((tela) => tela !== idTela)
        : [...atual.telas, idTela],
    }));
  };

  return (
    <>
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] font-sans antialiased">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header titulo="Perfis e acessos" icone={ShieldCheck} />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 p-4 sm:p-8">
            <section className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-800">
                  <LayoutGrid size={13} aria-hidden="true" />
                  Administração
                </span>
                <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
                  Perfis e acessos
                </h1>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  Crie perfis e defina quais telas cada tipo de usuário poderá acessar.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm">
                    <ShieldCheck size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xl font-black text-slate-900">{perfis.length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Perfis cadastrados</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={abrirNovoPerfil}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E7A3C] px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#165a2d]"
                >
                  <Plus size={16} aria-hidden="true" />
                  Novo perfil
                </button>
              </div>
            </section>

            <div className="flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3.5 text-sm text-sky-900">
              <Info size={18} className="mt-0.5 shrink-0 text-sky-700" aria-hidden="true" />
              <p>
                <span className="font-bold">Modo de demonstração.</span>{" "}
                Perfis e acessos são mantidos apenas nesta tela e ainda não alteram as permissões reais do sistema.
              </p>
            </div>

            <section aria-labelledby="perfis-title">
              <div className="mb-3 flex items-end justify-between gap-3 px-1">
                <div>
                  <h2 id="perfis-title" className="text-sm font-black text-slate-800">Tipos de perfil</h2>
                  <p className="mt-1 text-xs text-slate-500">Edite um perfil para ajustar as telas permitidas.</p>
                </div>
                <span className="text-xs font-semibold text-slate-400">{perfis.length} perfis</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {perfis.map((perfil) => {
                  const { id, nome, descricao, icon: Icon, cor } = perfil;
                  const quantidade = perfil.telas.length;
                  return (
                    <article key={id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <span className={`flex size-11 items-center justify-center rounded-xl ring-1 ${coresPerfil[cor]}`}>
                          <Icon size={20} aria-hidden="true" />
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                          {quantidade} telas
                        </span>
                      </div>
                      <h3 className="mt-4 text-base font-bold text-slate-900">{nome}</h3>
                      <p className="mt-1.5 min-h-10 text-xs leading-5 text-slate-500">{descricao || "Sem descrição."}</p>
                      <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3">
                        <button
                          type="button"
                          onClick={() => abrirEdicaoPerfil(perfil)}
                          aria-label={`Editar perfil ${nome}`}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Pencil size={14} aria-hidden="true" />
                          Editar acessos
                        </button>
                        <button
                          type="button"
                          onClick={() => setPerfilParaExcluir(perfil)}
                          aria-label={`Excluir perfil ${nome}`}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 size={14} aria-hidden="true" />
                          Excluir
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm" aria-labelledby="matriz-title">
              <div className="flex flex-col gap-1 border-b border-slate-100 px-5 py-4 sm:px-6">
                <h2 id="matriz-title" className="text-sm font-black text-slate-800">Acessos por tela</h2>
                <p className="text-xs text-slate-500">A matriz reflete as seleções feitas nos perfis desta sessão.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                      <th scope="col" className="px-5 py-3 sm:px-6">Tela do sistema</th>
                      {perfis.map((perfil) => (
                        <th key={perfil.id} scope="col" className="px-4 py-3 text-center">{perfil.nome}</th>
                      ))}
                    </tr>
                  </thead>
                  {GRUPOS_TELAS.map((grupo) => (
                    <tbody key={grupo.grupo}>
                      <tr className="border-t border-slate-100 bg-slate-50/60">
                        <th colSpan={perfis.length + 1} scope="colgroup" className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 sm:px-6">
                          {grupo.grupo}
                        </th>
                      </tr>
                      {grupo.telas.map((tela) => (
                        <tr key={tela.nome} className="border-t border-slate-100">
                          <th scope="row" className="px-5 py-3.5 text-sm font-semibold text-slate-700 sm:px-6">{tela.nome}</th>
                          {perfis.map((perfil) => {
                            const permitido = perfil.telas.includes(tela.id);
                            return (
                              <td key={perfil.id} className="px-4 py-3.5 text-center">
                                <span
                                  className={`mx-auto flex size-7 items-center justify-center rounded-full ${
                                    permitido ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-300"
                                  }`}
                                  role="img"
                                  aria-label={permitido ? `Acesso previsto para ${perfil.nome}` : `Sem acesso previsto para ${perfil.nome}`}
                                  title={permitido ? "Acesso previsto" : "Sem acesso previsto"}
                                >
                                  {permitido ? <Check size={15} aria-hidden="true" /> : <X size={14} aria-hidden="true" />}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  ))}
                </table>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-3 text-xs text-slate-500 sm:px-6">
                <span>{totalTelas} telas listadas</span>
                <span className="inline-flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-700" aria-hidden="true" />
                  Acesso previsto
                  <X size={14} className="ml-2 text-slate-400" aria-hidden="true" />
                  Sem acesso previsto
                </span>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>

      {modalAberto && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModalAberto(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="perfil-modal-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
          >
            <form onSubmit={salvarPerfil} className="flex max-h-[90vh] flex-col">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-7">
                <div>
                  <h2 id="perfil-modal-title" className="text-lg font-black text-slate-900">
                    {perfilEmEdicao ? "Editar perfil" : "Novo perfil"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Informe o perfil e marque as telas que ele poderá acessar.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  aria-label="Fechar formulário"
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-7">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-slate-700">Nome do perfil</span>
                  <input
                    autoFocus
                    value={formulario.nome}
                    onChange={(event) => {
                      setFormulario((atual) => ({ ...atual, nome: event.target.value }));
                      setErroFormulario("");
                    }}
                    maxLength={60}
                    placeholder="Ex.: Coordenador"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    aria-invalid={Boolean(erroFormulario)}
                    aria-describedby={erroFormulario ? "perfil-form-error" : undefined}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-slate-700">Descrição <span className="font-normal text-slate-400">(opcional)</span></span>
                  <textarea
                    value={formulario.descricao}
                    onChange={(event) => setFormulario((atual) => ({ ...atual, descricao: event.target.value }))}
                    maxLength={180}
                    rows={2}
                    placeholder="Resumo das responsabilidades deste perfil"
                    className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>

                <fieldset>
                  <legend className="mb-2 text-xs font-bold text-slate-700">Telas permitidas</legend>
                  <div className="overflow-hidden rounded-2xl border border-slate-200">
                    {GRUPOS_TELAS.map((grupo) => (
                      <div key={grupo.grupo}>
                        <p className="border-y border-slate-100 bg-slate-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                          {grupo.grupo}
                        </p>
                        <div className="divide-y divide-slate-100">
                          {grupo.telas.map((tela) => (
                            <label key={tela.id} className="flex cursor-pointer items-center justify-between gap-4 px-4 py-3 text-sm text-slate-700 transition hover:bg-emerald-50/50">
                              <span>{tela.nome}</span>
                              <input
                                type="checkbox"
                                checked={formulario.telas.includes(tela.id)}
                                onChange={() => alternarTela(tela.id)}
                                className="size-4 accent-emerald-700"
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </fieldset>
                {erroFormulario && (
                  <p id="perfil-form-error" role="alert" className="text-sm font-semibold text-red-600">
                    {erroFormulario}
                  </p>
                )}
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                <button type="button" onClick={() => setModalAberto(false)} className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-100">
                  Cancelar
                </button>
                <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E7A3C] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#165a2d]">
                  <Check size={15} aria-hidden="true" />
                  {perfilEmEdicao ? "Salvar alterações" : "Criar perfil"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      <ConfirmDialog
        aberto={Boolean(perfilParaExcluir)}
        titulo="Excluir perfil"
        mensagem={`Deseja excluir o perfil "${perfilParaExcluir?.nome}"? Esta alteração será perdida ao sair desta tela.`}
        onConfirm={confirmarExclusaoPerfil}
        onCancel={() => setPerfilParaExcluir(null)}
        variant="danger"
        confirmText="Excluir perfil"
      />
    </>
  );
}

export default PerfisAcessos;
