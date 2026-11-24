import UserRound from "lucide-react/icons/user-round";
import GraduationCap from "lucide-react/icons/graduation-cap";
import ClipboardList from "lucide-react/icons/clipboard-list";
import ArrowRight from "lucide-react/icons/arrow-right";
import { useNavigate } from "react-router-dom";
import sessionService from "../../../services/sessionService";

const iconMap = {
  Administrador: UserRound,
  instrutor: GraduationCap,
  secretario: ClipboardList,
};

const styleMap = {
  Administrador: {
    icon: "bg-blue-50 text-blue-700",
    badge: "border-blue-100 bg-blue-50 text-blue-700",
    hover: "group-hover:border-blue-200 group-hover:bg-blue-50/30",
  },
  instrutor: {
    icon: "bg-emerald-50 text-emerald-700",
    badge: "border-emerald-100 bg-emerald-50 text-emerald-700",
    hover: "group-hover:border-emerald-200 group-hover:bg-emerald-50/30",
  },
  secretario: {
    icon: "bg-amber-50 text-amber-700",
    badge: "border-amber-100 bg-amber-50 text-amber-700",
    hover: "group-hover:border-amber-200 group-hover:bg-amber-50/30",
  },
};

function getProfileKey(nomePerfil) {
  if (!nomePerfil) return "instrutor";

  const normalized = String(nomePerfil)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  if (normalized.includes("admin")) return "Administrador";
  if (normalized.includes("secret")) return "secretario";
  return "instrutor";
}

export default function Card({ tipo, descricao, badge, rota }) {
  const profileKey = getProfileKey(tipo);
  const Icone = iconMap[profileKey] ?? UserRound;
  const estilos = styleMap[profileKey] ?? styleMap.instrutor;
  const navigate = useNavigate();

  const handleClick = () => {
    sessionService.setSelectedProfile(profileKey);
    navigate(rota);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Acessar como ${tipo}`}
      className={`group flex min-h-48 w-full max-w-[280px] flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${estilos.hover}`}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <div className={`flex size-11 items-center justify-center rounded-xl ${estilos.icon}`}>
          <Icone size={21} strokeWidth={1.8} />
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${estilos.badge}`}>
          {badge}
        </span>
      </div>

      <h3 className="mt-5 text-base font-bold text-slate-900">{tipo}</h3>
      <p className="mt-1.5 flex-1 text-xs leading-5 text-slate-500">
        {descricao}
      </p>

      <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-slate-700 transition group-hover:text-emerald-800">
        Continuar
        <ArrowRight
          size={15}
          className="transition-transform group-hover:translate-x-1"
        />
      </span>
    </button>
  );
}
