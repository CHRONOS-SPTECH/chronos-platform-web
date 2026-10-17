import { X, UserPlus, UserCheck } from "lucide-react";
import { useState, useEffect } from "react";
import authService from "../../services/authService";
import { useToast } from "../alert-toast/ToastProvider";
// import pessoaService from "../../services/pessoaService"; // Importe seu serviço de busca de pessoas

export default function ModalUsuario({ isOpen, onClose, onSuccess }) {
  const toast = useToast();
  const [isNovaPessoa, setIsNovaPessoa] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [pessoasExistentes, setPessoasExistentes] = useState([]);
  const [novoUsuario, setNovoUsuario] = useState({
    pessoaId: "",
    nome: "",
    emailPessoa: "",
    genero: "",
    nascimento: "",
    emailLogin: "",
    perfilId: "1",
    senha: "senhaSegura123",
  });
  const inputStyle =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#1E7A3C] focus:bg-white focus:ring-2 focus:ring-green-700/10 disabled:opacity-50";

  useEffect(() => {
    if (!isNovaPessoa && isOpen) {
      setPessoasExistentes([
        { id: 1, nome: "Henrique Silva" },
        { id: 2, nome: "João Silva" },
      ]);
    }
  }, [isNovaPessoa, isOpen]);

  if (!isOpen) return null;

  function preencherUsuario(e) {
    const { name, value } = e.target;
    setNovoUsuario((prev) => ({ ...prev, [name]: value }));
  }

  async function cadastrarUsuario(e) {
    e.preventDefault();

    const payload = {
      pessoa: isNovaPessoa
        ? {
            nome: novoUsuario.nome,
            email: novoUsuario.emailPessoa,
            telefone: "11999999999",
            genero: novoUsuario.genero,
            cpf: Math.random().toString().slice(2, 13), // Simulação de CPF único para teste
            bolsista: false,
            data_nascimento: novoUsuario.nascimento,
          }
        : null,
      pessoa_id: !isNovaPessoa ? parseInt(novoUsuario.pessoaId) : null,
      perfis_id: [parseInt(novoUsuario.perfilId)],
      email_login: novoUsuario.emailLogin,
      senha: novoUsuario.senha,
    };

    setSalvando(true);
    try {
      await authService.register(payload);
      if (onSuccess) await onSuccess();
      onClose();
    } catch (error) {
      const msg = error.response?.data?.message || "Erro ao cadastrar usuário";
      toast.error(msg);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]" role="presentation">
      <div role="dialog" aria-modal="true" aria-labelledby="usuario-modal-title" className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          {/* Header */}
          <div className="-mx-8 -mt-8 mb-6 flex justify-between items-start border-b border-slate-700 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-800 px-8 py-6 text-white">
            <div>
              <h2 id="usuario-modal-title" className="text-2xl font-bold text-white tracking-tight">
                Configurar Usuário
              </h2>
              <p className="text-slate-300 text-sm font-medium">
                Defina como deseja criar o acesso ao sistema.
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={salvando}
              className="rounded-full p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              <X size={24} />
            </button>
          </div>

          {/* Toggle Nova Pessoa / Existente */}
          <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setIsNovaPessoa(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${isNovaPessoa ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700"}`}
            >
              <UserPlus size={18} /> Nova Pessoa
            </button>
            <button
              type="button"
              onClick={() => setIsNovaPessoa(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${!isNovaPessoa ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700"}`}
            >
              <UserCheck size={18} /> Já Cadastrada
            </button>
          </div>

          <form onSubmit={cadastrarUsuario} className="flex flex-col gap-4">
            {isNovaPessoa ? (
              <div className="space-y-4 animate-in slide-in-from-left-2 duration-300">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    Nome Completo
                  </label>
                  <input
                    name="nome"
                    type="text"
                    required
                    className={inputStyle}
                    value={novoUsuario.nome}
                    onChange={preencherUsuario}
                    placeholder="Ex: Henrique Silva"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                    E-mail Pessoal
                  </label>
                  <input
                    name="emailPessoa"
                    type="email"
                    required
                    className={inputStyle}
                    value={novoUsuario.emailPessoa}
                    onChange={preencherUsuario}
                    placeholder="pessoa@email.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                      Gênero
                    </label>
                    <select
                      name="genero"
                      required
                      className={inputStyle}
                      value={novoUsuario.genero}
                      onChange={preencherUsuario}
                    >
                      <option value="">Selecione</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">
                      Nascimento
                    </label>
                    <input
                      name="nascimento"
                      type="date"
                      required
                      className={inputStyle}
                      value={novoUsuario.nascimento}
                      onChange={preencherUsuario}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 animate-in slide-in-from-right-2 duration-300">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Vincular a:
                </label>
                <select
                  name="pessoaId"
                  required
                  className={inputStyle}
                  value={novoUsuario.pessoaId}
                  onChange={preencherUsuario}
                >
                  <option value="">Selecione uma pessoa...</option>
                  {pessoasExistentes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} (ID: {p.id})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="h-px bg-gray-100 my-2" />

            {/* Campos de Login (Sempre visíveis) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                E-mail de Login
              </label>
              <input
                name="emailLogin"
                type="email"
                required
                className={inputStyle}
                value={novoUsuario.emailLogin}
                onChange={preencherUsuario}
                placeholder="usuario@sistema.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                Perfil de Acesso
              </label>
              <select
                name="perfilId"
                className={inputStyle}
                value={novoUsuario.perfilId}
                onChange={preencherUsuario}
              >
                <option value="1">Administrador</option>
                <option value="2">Secretário</option>
                <option value="3">Instrutor</option>
              </select>
            </div>

            {/* Ações */}
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={salvando}
                className="flex-1 rounded-xl py-3.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="flex-1 rounded-xl bg-[#1E7A3C] py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#165a2d] active:scale-[0.99] disabled:cursor-wait disabled:opacity-60"
              >
                {salvando ? "Salvando..." : "Salvar Acesso"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
