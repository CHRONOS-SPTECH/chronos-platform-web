import { X } from "lucide-react";
import { useState } from "react";
import authService from "../../services/authService";

export default function ModalUsuario({ isOpen, onClose, onSuccess }) {
  if (!isOpen) return null;

  const [novoUsuario, setNovoUsuario] = useState({
    nome: "",
    email: "",
    genero: "",
    nascimento: "",
    perfil: "",
  });

  async function cadastrarUsuario(e) {
    e.preventDefault();

    const payload = {
      pessoa: {
        nome: novoUsuario.nome,
        genero: novoUsuario.genero,
        dataNascimento: novoUsuario.nascimento,
      },
      perfilAcesso: novoUsuario.perfil === "" ? null : novoUsuario.perfil,
      senha: "senha1234",
      email_login: novoUsuario.email,
      status_ativo: true,
    };

    try {
      const response = await authService.register(payload);

      console.log("Usuário cadastrado com sucesso:", response.data);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    }
  }

  function preencherUsuario(e) {
    const { name, value } = e.target;
    setNovoUsuario((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Cadastrar Usuário
              </h2>
              <p className="text-gray-400 text-sm font-medium">
                Preencha os dados do novo membro.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={cadastrarUsuario} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                Nome Completo
              </label>
              <input
                type="text"
                name="nome"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-green-500/20"
                value={novoUsuario.nome}
                onChange={preencherUsuario}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-green-500/20"
                value={novoUsuario.email}
                onChange={preencherUsuario}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Gênero
                </label>
                <select
                  name="genero"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none cursor-pointer"
                  value={novoUsuario.genero}
                  onChange={preencherUsuario}
                >
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Nascimento
                </label>
                <input
                  type="date"
                  name="nascimento"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none"
                  value={novoUsuario.nascimento}
                  onChange={preencherUsuario}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                Perfil de Acesso
              </label>
              <select
                name="perfil"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none cursor-pointer"
                value={novoUsuario.perfil}
                onChange={preencherUsuario}
              >
                <option value="">Secretário (Padrão)</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl text-gray-500 font-bold text-sm hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 rounded-2xl bg-black text-white font-bold text-sm hover:bg-gray-800 shadow-xl shadow-gray-200"
              >
                Salvar Usuário
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
