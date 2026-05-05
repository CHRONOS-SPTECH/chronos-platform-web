import { useState } from "react";
import TabelaAlunos from "./TabelaAlunos";
import ModalConfirmacao from "./ModalConfirmacao";

function CardPresenca({ alunos }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="overflow-hidden h-auto animate-in fade-in duration-500">
      {/* CORPO */}
      <div className="">
        <h3 className="text-base font-bold text-gray-700 mb-4">
          Frequência Diária - Turma 3 | Aula 2 (Filosofia antiga)
        </h3>

        <TabelaAlunos alunos={alunos} />

        <div className="flex justify-end gap-3 mt-6">
          <button className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-gray-600 hover:bg-gray-700 transition-colors">
            Cancelar
          </button>

          {/* BOTÃO*/}
          <button
            className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-[#00871D] hover:bg-[#006d17] transition-colors shadow-md"
            onClick={() => setIsModalOpen(true)}
          >
            Salvar Chamada
          </button>
        </div>
      </div>

      {/*MODAL*/}
      <ModalConfirmacao
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        alunos={alunos}
      />
    </section>
  );
}

export default CardPresenca;
