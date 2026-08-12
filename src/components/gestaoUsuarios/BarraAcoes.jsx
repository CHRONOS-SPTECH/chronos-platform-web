import { Search, UserPlus } from "lucide-react";

export default function BarraAcoes({ onNovoClick }) {
  return (
    <div className="flex gap-4">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Buscar usuários..."
          className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00871D]/10 transition-all w-72 shadow-sm"
        />
      </div>
      <button
        onClick={onNovoClick}
        className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-300/50"
      >
        <UserPlus size={18} />
        Novo Usuário
      </button>
    </div>
  );
}
