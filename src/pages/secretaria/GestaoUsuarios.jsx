import React, { useState } from "react";
import { Users } from "lucide-react";
import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/homeSecretario/Header";

import BarraAcoes from "../../components/gestaoUsuarios/BarraAcoes";
import CardUsuario from "../../components/gestaoUsuarios/CardUsuarios";
import Paginacao from "../../components/gestaoUsuarios/Paginacao";
import ModalUsuario from "../../components/gestaoUsuarios/ModalUsuario";
import useUsuarios from "../../hooks/useUsuarios";

function GestaoUsuarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { usuarios, carregarUsuarios } = useUsuarios();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen">
        <Header titulo="Gestão de Usuários" icone={Users} />

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 p-4 sm:p-8">
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/80 via-white to-white p-5 sm:flex-row sm:items-center">
              <div><h1 className="text-lg font-bold text-slate-800">Usuários cadastrados</h1><p className="mt-1 text-sm text-slate-500">Gerencie os acessos e perfis do sistema.</p></div>
              <BarraAcoes onNovoClick={() => setIsModalOpen(true)} />
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-3 hidden grid-cols-12 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-slate-100 md:grid">
                <div className="col-span-4">Informações de Usuário</div>
                <div className="col-span-3">Perfil de Acesso</div>
                <div className="col-span-2">Nascimento</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-1 text-right">Ações</div>
              </div>

              <div className="flex flex-col gap-3">
              {usuarios.map((user) => (
                <CardUsuario key={user.id_usuario || user.id || user.email_login} usuario={user} />
              ))}
              </div>
            </div>

            <Paginacao totalItens={usuarios.length} />
          </div>
        </div>
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
