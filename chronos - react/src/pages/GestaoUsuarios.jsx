import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";
import Sidebar from "../components/sidebar/SideBar";
import Header from "../components/homeSecretario/Header";
import Profile from "../components/homeSecretario/Profile";

import BarraAcoes from "../components/gestaoUsuarios/BarraAcoes";
import CardUsuario from "../components/gestaoUsuarios/CardUsuarios";
import Paginacao from "../components/gestaoUsuarios/Paginacao";
import ModalUsuario from "../components/gestaoUsuarios/ModalUsuario";
import api from "../services/api";

function GestaoUsuarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarios, setUsuarios] = useState([]);

  const fetchUsuarios = async () => {
    try {
      const response = await api.get("/usuarios");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <div className="flex h-screen bg-[#F1F5F9] overflow-hidden">
      <Sidebar
        tipoUsuario="secretario"
        usuario={{ inicial: "H", nome: "Henrique" }}
      />
      <div className="flex-1 flex flex-col h-screen">
        <Header titulo="Gestão de Usuários" icone={Users} />

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-8 flex flex-col gap-8">
            <div className="flex flex-row justify-between items-center">
              <Profile nome="Henrique" cargo="Secretário" />
              <BarraAcoes onNovoClick={() => setIsModalOpen(true)} />
            </div>

            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-12 px-8 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">
                <div className="col-span-4">Informações de Usuário</div>
                <div className="col-span-3">Perfil de Acesso</div>
                <div className="col-span-2">Nascimento</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-1 text-right">Ações</div>
              </div>

              {usuarios.map((user, i) => (
                <CardUsuario key={i} usuario={user} />
              ))}
            </div>

            <Paginacao totalItens={usuarios.length} />
          </div>
        </div>
      </div>

      <ModalUsuario
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchUsuarios} // Passa a função aqui
      />
    </div>
  );
}

export default GestaoUsuarios;
