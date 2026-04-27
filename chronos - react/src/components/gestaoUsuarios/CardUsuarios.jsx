import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

function CardUsuario({ usuario }) {
  return (
    <div className="grid grid-cols-12 items-center bg-white px-8 py-5 rounded-2xl border border-white hover:border-green-200 hover:shadow-xl hover:shadow-gray-200/40 transition-all group">
      <div className="col-span-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center text-gray-400 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
          <User size={22} />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-gray-800 group-hover:text-black transition-colors">
            {usuario.pessoa.nome}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5 font-medium">
            <Mail size={12} /> {usuario.email_login}
          </span>
        </div>
      </div>

      <div className="col-span-3">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg ${usuario.perfilAcesso ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-300"}`}
          >
            <ShieldCheck size={16} />
          </div>
          <span
            className={`text-sm font-bold ${usuario.perfilAcesso ? "text-gray-700" : "text-gray-300 italic"}`}
          >
            {usuario.perfilAcesso ? "Administrador" : "Secretário"}
          </span>
        </div>
      </div>

      <div className="col-span-2 text-gray-500 font-medium text-sm flex items-center gap-2">
        <Calendar size={16} className="opacity-40" />
        {new Date(usuario.pessoa.data_nascimento).toLocaleDateString("pt-BR")}
      </div>

      <div className="col-span-2 flex justify-center">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${usuario.status_ativo ? "bg-green-50 border-green-100 text-green-600" : "bg-gray-50 border-gray-100 text-gray-400"}`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${usuario.status_ativo ? "bg-green-500" : "bg-gray-300"}`}
          />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {usuario.status_ativo ? "Ativo" : "Inativo"}
          </span>
        </div>
      </div>

      <div className="col-span-1 flex justify-end gap-1">
        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
          <Eye size={18} />
        </button>
        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
          <Pencil size={18} />
        </button>
        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default CardUsuario;
