import { UserRound, GraduationCap, ClipboardList } from "lucide-react"; // importando icones
import { useNavigate } from "react-router-dom";

// mapeando icone de acordo com o perfil
const iconMap = {
  Administrador: UserRound,
  Instrutor: GraduationCap,
  Secretária: ClipboardList,
};

function Card({ tipo, descricao, badge, rota }) {
  const Icone = iconMap[tipo] ?? UserRound;
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-2xl shadow-md p-10 w-64 h-80 flex flex-col items-center gap-5 mb-8 cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all "
      onClick={() => navigate(rota)}
    >
      {/* Ícone */}
      <div className="w-20 h-20 bg-[#d6f0df] rounded-full flex items-center justify-center mb-2 gap-3">
        <Icone size={36} color="#1E7A3C" strokeWidth={1.5} />
      </div>

      {/* Texto */}
      <h3 className="font-semibold text-gray-800 text-center">{tipo}</h3>
      <p className="text-xs text-gray-800 text-center leading-relaxed">
        {descricao}
      </p>

      {/* Badge */}
      <span className="mt-1 text-xs text-gray-500 border border-gray-300 rounded-full px-4 py-1 bg-gray-50">
        {badge}
      </span>
    </div>
  );
}

export default Card;
