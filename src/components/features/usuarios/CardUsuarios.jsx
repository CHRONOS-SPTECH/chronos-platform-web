import User from "lucide-react/icons/user";
import Mail from "lucide-react/icons/mail";
import ShieldCheck from "lucide-react/icons/shield-check";
import Calendar from "lucide-react/icons/calendar";

function obterPerfil(usuario) {
  const perfis = Array.isArray(usuario.perfis)
    ? usuario.perfis
        .map((perfil) => perfil?.nome_perfil || perfil?.nome)
        .filter(Boolean)
    : [];
  const perfilUnico =
    usuario.perfil?.nome_perfil ||
    usuario.perfil?.nome ||
    usuario.nome_perfil;

  if (perfis.length > 0) return perfis.join(", ");
  if (perfilUnico) return perfilUnico;
  return usuario.perfilAcesso ? "Administrador" : "Secretário";
}

function formatarNascimento(data) {
  if (!data) return "Não informado";
  const dataValida = new Date(data);
  return Number.isNaN(dataValida.getTime())
    ? "Não informado"
    : dataValida.toLocaleDateString("pt-BR");
}

function CardUsuario({ usuario }) {
  const nome = usuario.pessoa?.nome || usuario.nome || "Usuário";
  const email = usuario.email_login || usuario.pessoa?.email || "E-mail não informado";
  const ativo = Boolean(usuario.status_ativo);

  return (
    <article className="grid grid-cols-1 items-center gap-4 rounded-2xl border border-slate-100 bg-white px-4 py-4 transition-colors hover:border-emerald-200 hover:bg-emerald-50/20 sm:px-5 md:grid-cols-12 md:gap-0">
      <div className="flex min-w-0 items-center gap-3 md:col-span-5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <User size={20} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-800">{nome}</p>
          <p className="mt-1 flex min-w-0 items-center gap-1.5 truncate text-xs font-medium text-slate-500">
            <Mail size={12} className="shrink-0 text-slate-400" aria-hidden="true" />
            <span className="truncate">{email}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:col-span-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
          <ShieldCheck size={16} aria-hidden="true" />
        </span>
        <span className="text-sm font-semibold text-slate-700">{obterPerfil(usuario)}</span>
      </div>

      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 md:col-span-2">
        <Calendar size={15} className="text-slate-400" aria-hidden="true" />
        <span className="md:hidden">Nascimento:</span>
        {formatarNascimento(usuario.pessoa?.data_nascimento || usuario.data_nascimento)}
      </div>

      <div className="flex md:col-span-2 md:justify-end">
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${
            ativo
              ? "border-emerald-100 bg-emerald-50 text-emerald-700"
              : "border-slate-200 bg-slate-50 text-slate-500"
          }`}
        >
          <span className={`size-1.5 rounded-full ${ativo ? "bg-emerald-500" : "bg-slate-400"}`} />
          {ativo ? "Ativo" : "Inativo"}
        </span>
      </div>
    </article>
  );
}

export default CardUsuario;
