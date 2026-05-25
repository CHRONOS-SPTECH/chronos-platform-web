import { useState, useEffect } from "react";
import TabelaAlunos from "./TabelaAlunos";
import ModalConfirmacao from "./ModalConfirmacao";
import { BookOpen } from "lucide-react";
import api from "../../services/api";

function CardPresenca({ alunos, dadosAula }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alunosState, setAlunosState] = useState([]);
  const [isSending, setIsSending] = useState(false);

  // Inicializa/atualiza estado local quando a prop muda
  useEffect(() => {
    if (!alunos) return;
    const inicial = alunos.map((a) => ({ ...a, presente: !!a.presente }));
    setAlunosState(inicial);
  }, [alunos]);

  const onTogglePresenca = (index) => {
    setAlunosState((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], presente: !copy[index].presente };
      return copy;
    });
  };

  const salvarChamada = async () => {
    setIsSending(true);
    try {
      if (!dadosAula || !dadosAula.id_aula) {
        console.error("id_aula não disponível em dadosAula");
        return;
      }

      // Agrupa os dados conforme solicitado
      const payload = alunosState.map((aluno) => ({
        id_aula: dadosAula.id_aula,
        id_pessoa: aluno.id_pessoa ?? aluno.id ?? null,
        compareceu: !!aluno.presente,
      }));

      console.log("Payload a ser enviado:", payload);

      // Envia em lote para o endpoint
      await api.post("/chamadas-aula", payload);

      // fechar modal e opcionalmente notificar
      setIsModalOpen(false);
      alert("Chamada enviada com sucesso.");
    } catch (error) {
      console.error("Erro ao enviar chamada:", error);
      alert("Falha ao enviar chamada. Verifique o console.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="overflow-hidden h-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
        <div className="flex items-center gap-2.5 text-slate-700">
          <BookOpen size={18} className="text-slate-400" />
          <h3 className="text-sm font-bold tracking-tight">
            Aula {dadosAula?.id_aula || "N/A"}:{" "}
            <span className="text-slate-500 font-medium">Filosofia Antiga</span>
          </h3>
        </div>

        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
          Lista de Frequência Diária
        </span>
      </div>

      {/* TABELA DE ALUNOS */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <TabelaAlunos
          alunos={alunosState}
          onTogglePresenca={onTogglePresenca}
        />
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
        alunos={alunosState}
        onTogglePresenca={onTogglePresenca}
        onConfirm={salvarChamada}
        isSending={isSending}
      />
    </section>
  );
}

export default CardPresenca;
