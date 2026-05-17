import perfil from "../../assets/perfil.svg";

function Profile({ nome = "Instrutor", cargo = "Instrutor", avatar = perfil }) {
  return (
    <div className="flex flex-row gap-5 items-center group cursor-pointer rounded-2xl">
      <div className="relative">
        <div className="absolute inset-0 bg-[#1E7A3C] rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity"></div>
        <img
          src={avatar}
          alt={`Foto de perfil de ${nome}`}
          className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 relative z-10"
        />
        <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full z-20"></span>
      </div>

      <div className="flex flex-col items-start justify-center">
        <h2 className="text-[15px] font-black text-slate-800 text-base tracking-tight group-hover:text-[#1E7A3C] transition-colors leading-none">
          {nome}
        </h2>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 rounded-md font-bold text-[8px] uppercase tracking-[0.1em] border border-slate-200 group-hover:bg-green-50 group-hover:text-[#1E7A3C] group-hover:border-green-100 transition-all">
            {cargo}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Profile;
