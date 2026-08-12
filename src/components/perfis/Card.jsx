import { UserRound, GraduationCap, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import sessionService from "../../services/sessionService";

const iconMap = {
  Administrador: UserRound,
  instrutor: GraduationCap,
  secretario: ClipboardList,
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
  return "instrutor"; // Fallback para instrutor/diretor
}

export default function Card({ tipo, descricao, badge, rota }) {
  const profileKey = getProfileKey(tipo);
  const Icone = iconMap[profileKey] ?? UserRound;
  const navigate = useNavigate();

  const handleClick = () => {
    // Salva o perfil limpo (ex: "secretario") como a única fonte de verdade
    sessionService.setSelectedProfile(profileKey);
    navigate(rota);
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-md p-10 w-64 h-80 flex flex-col items-center gap-5 mb-8 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all"
      onClick={handleClick}
    >
      <div className="w-20 h-20 bg-[#d6f0df] rounded-full flex items-center justify-center mb-2 gap-3">
        <Icone size={36} color="#1E7A3C" strokeWidth={1.5} />
      </div>

      <h3 className="font-semibold text-gray-800 text-center">{tipo}</h3>
      <p className="text-xs text-gray-800 text-center leading-relaxed">
        {descricao}
      </p>

      <span className="mt-1 text-xs text-gray-500 border border-gray-300 rounded-full px-4 py-1 bg-gray-50">
        {badge}
      </span>
    </div>
  );
}
