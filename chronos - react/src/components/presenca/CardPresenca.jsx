import { useState } from "react";
import TabelaAlunos from "./TabelaAlunos";
import ModalConfirmacao from "./ModalConfirmacao";
import { BookOpen } from "lucide-react";

function CardPresenca({ alunos }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="overflow-hidden h-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
        <div className="flex items-center gap-2.5 text-slate-700">
          <BookOpen size={18} className="text-slate-400" />
          <h3 className="text-sm font-bold tracking-tight">
            Aula 02:{" "}
            <span className="text-slate-500 font-medium">Filosofia Antiga</span>
          </h3>
        </div>

        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
          Lista de Frequência Diária
        </span>
      </div>

      {/* TABELA DE ALUNOS */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <TabelaAlunos alunos={alunos} />
      </div>

      {/* AÇÕES DE RODAPÉ */}
      <div className="flex justify-end gap-3 mt-6">
        <button className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors">
          Cancelar
        </button>

        <button
          className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#1E7A3C] hover:bg-[#165a2d] transition-colors shadow-md shadow-green-100/50 active:scale-[0.98]"
          onClick={() => setIsModalOpen(true)}
        >
          Salvar Chamada
        </button>
      </div>

      {/* MODAL DE CONFIRMAÇÃO */}
      <ModalConfirmacao
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        alunos={alunos}
      />
    </section>
  );
}

export default CardPresenca;
