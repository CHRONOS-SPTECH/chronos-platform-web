import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Paginacao({ totalItens }) {
  return (
    <div className="flex justify-between items-center mt-4 px-2">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
        Total de <span className="text-gray-900">{totalItens}</span> usuários
      </span>
      <div className="flex items-center gap-2">
        <button className="p-2 text-gray-400 hover:text-black transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex gap-1">
          <span className="w-8 h-8 flex items-center justify-center rounded-xl bg-black text-white text-xs font-bold shadow-lg shadow-gray-300">
            1
          </span>
          <span className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white text-gray-500 text-xs font-bold transition-all cursor-pointer">
            2
          </span>
        </div>
        <button className="p-2 text-gray-400 hover:text-black transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
