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
    <div className="group grid grid-cols-1 items-center gap-4 rounded-xl border border-slate-100 bg-white px-4 py-4 transition-all hover:border-emerald-200 hover:bg-emerald-50/20 hover:shadow-sm sm:px-6 md:grid-cols-12 md:gap-0 md:py-5">
      <div className="flex items-center gap-4 md:col-span-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-100">
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

      <div className="md:col-span-3">
        <div className="flex items-center gap-2">
          <div
            className={`rounded-lg p-1.5 ${usuario.perfilAcesso ? "bg-violet-50 text-violet-600" : "bg-slate-50 text-slate-300"}`}
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

      <div className="flex items-center gap-2 text-sm font-medium text-slate-500 md:col-span-2">
        <Calendar size={16} className="opacity-40" />
        {new Date(usuario.pessoa.data_nascimento).toLocaleDateString("pt-BR")}
      </div>

      <div className="flex justify-start md:col-span-2 md:justify-center">
        <div
          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${usuario.status_ativo ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-slate-100 bg-slate-50 text-slate-400"}`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${usuario.status_ativo ? "bg-green-500" : "bg-gray-300"}`}
          />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {usuario.status_ativo ? "Ativo" : "Inativo"}
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-1 md:col-span-1">
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
