import perfil from "../../assets/perfil.svg";

/**
 * Props:
 * - nome: string
 * - cargo: string
 * - avatar: string
 */
function Profile({ nome = "Henrique", cargo = "Secretário", avatar = perfil }) {
  return (
    <div className="flex flex-row gap-4 items-center group cursor-pointer rounded-xl transition-all">
      <div className="relative">
        <img
          src={avatar}
          alt={`Foto de perfil de ${nome}`}
          className="w-16 h-16 rounded-full object-cover border-2 border-transparent group-hover:border-[#228B22] transition-all shadow-sm"
        />
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
      </div>

      <div className="flex flex-col items-start leading-tight">
        <h2 className="font-bold text-gray-800 text-[15px] group-hover:text-[#228B22] transition-colors">
          {nome}
        </h2>

        <span className="mt-1 px-3 py-0.5 bg-[#228B22]/10 text-[#228B22] border border-[#228B22]/20 rounded-full font-medium text-[11px] uppercase tracking-wider">
          {cargo}
        </span>
      </div>
    </div>
  );
}

export default Profile;
