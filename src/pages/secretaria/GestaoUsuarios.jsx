import React, { useMemo, useState } from "react";
import Users from "lucide-react/icons/users";
import ShieldCheck from "lucide-react/icons/shield-check";
import UserCheck from "lucide-react/icons/user-check";
import UserPlus from "lucide-react/icons/user-plus";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";

import BarraAcoes from "../../components/features/usuarios/BarraAcoes";
import CardUsuario from "../../components/features/usuarios/CardUsuarios";
import ModalUsuario from "../../components/features/usuarios/ModalUsuario";
import useUsuarios from "../../hooks/useUsuarios";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/DataState";

function GestaoUsuarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const { usuarios, carregando, erro, carregarUsuarios } = useUsuarios();
  const usuariosFiltrados = useMemo(() => {
    const termo = termoBusca.trim().toLocaleLowerCase("pt-BR");
    return usuarios.filter((usuario) => {
      const nome = usuario.pessoa?.nome || usuario.nome || "";
      const email = usuario.email_login || usuario.pessoa?.email || "";
      const correspondeBusca = [nome, email].some((valor) =>
        String(valor).toLocaleLowerCase("pt-BR").includes(termo),
      );
      const correspondeStatus =
        filtroStatus === "todos" ||
        (filtroStatus === "ativos" && usuario.status_ativo) ||
        (filtroStatus === "inativos" && !usuario.status_ativo);
      return correspondeBusca && correspondeStatus;
    });
  }, [usuarios, termoBusca, filtroStatus]);

  const usuariosAtivos = usuarios.filter((usuario) => usuario.status_ativo).length;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] font-sans antialiased">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header titulo="Gestão de Usuários" icone={Users} />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 p-4 sm:p-8">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-5 bg-gradient-to-br from-emerald-50 via-white to-white p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-800">
                    <ShieldCheck size={13} aria-hidden="true" />
                    Administração
                  </span>
                  <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
                    Usuários
                  </h1>
                  <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                    Gerencie as contas, acompanhe os perfis e mantenha os acessos da plataforma organizados.
                  </p>
                </div>
                <BarraAcoes
                  termoBusca={termoBusca}
                  onBuscaChange={setTermoBusca}
                  onNovoClick={() => setIsModalOpen(true)}
                />
              </div>

              <div className="grid border-t border-slate-100 sm:grid-cols-3">
                <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:border-b-0 sm:border-r sm:px-7">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <Users size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xl font-black text-slate-900">{carregando ? "—" : usuarios.length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Contas cadastradas</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:border-b-0 sm:border-r sm:px-7">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <UserCheck size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xl font-black text-slate-900">{carregando ? "—" : usuariosAtivos}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Acessos ativos</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-4 sm:px-7">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <ShieldCheck size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xl font-black text-slate-900">{carregando ? "—" : new Set(usuarios.map((usuario) => usuario.perfil?.nome_perfil || usuario.nome_perfil).filter(Boolean)).size || "—"}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tipos de perfil</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <h2 className="text-sm font-black text-slate-800">Contas cadastradas</h2>
                  <p className="mt-1 text-xs text-slate-500">Consulte os dados e o status de acesso dos usuários.</p>
                </div>
                <label className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500 sm:self-auto">
                  Status
                  <select
                    value={filtroStatus}
                    onChange={(event) => setFiltroStatus(event.target.value)}
                    className="bg-transparent text-xs font-bold text-slate-700 outline-none"
                    aria-label="Filtrar usuários por status"
                  >
                    <option value="todos">Todos</option>
                    <option value="ativos">Ativos</option>
                    <option value="inativos">Inativos</option>
                  </select>
                </label>
              </div>

              <div className="p-4 sm:p-6">
                <div className="mb-3 hidden grid-cols-12 rounded-xl bg-slate-50 px-5 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400 md:grid">
                  <div className="col-span-5">Usuário</div>
                  <div className="col-span-3">Perfil de acesso</div>
                  <div className="col-span-2">Nascimento</div>
                  <div className="col-span-2 text-right">Status</div>
                </div>

                {carregando ? (
                  <LoadingState message="Carregando usuários..." />
                ) : erro ? (
                  <ErrorState message={erro} onRetry={carregarUsuarios} />
                ) : usuariosFiltrados.length === 0 ? (
                  <EmptyState
                    title={usuarios.length === 0 ? "Nenhum usuário cadastrado" : "Nenhum usuário encontrado"}
                    description={usuarios.length === 0 ? "Cadastre um usuário para liberar o acesso ao sistema." : "Tente ajustar a busca ou o filtro de status."}
                    action={usuarios.length === 0 ? (
                      <button type="button" onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-[#1E7A3C] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#165a2d]">
                        <UserPlus size={15} /> Novo usuário
                      </button>
                    ) : undefined}
                  />
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {usuariosFiltrados.map((user) => (
                      <CardUsuario key={user.id_usuario || user.id || user.email_login} usuario={user} />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>

      <ModalUsuario
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={carregarUsuarios}
      />
    </div>
  );
}

export default GestaoUsuarios;
