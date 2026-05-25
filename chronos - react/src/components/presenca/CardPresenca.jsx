import { useState, useEffect } from "react";
import TabelaAlunos from "./TabelaAlunos";
import ModalConfirmacao from "./ModalConfirmacao";
import { BookOpen } from "lucide-react";
import api from "../../services/api";

function CardPresenca({ alunos, dadosAula }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [listaAlunos, setListaAlunos] = useState([]);
  const [carregando, setCarregando] = useState(false);

  // Assim que o componente carrega, preparamos a lista de alunos
  useEffect(() => {
    if (!alunos) return;

    const listaInicial = alunos.map((aluno) => {
      return {
        ...aluno,
        presente: aluno.presente === true,
      };
    });

    setListaAlunos(listaInicial);
  }, [alunos]);

  // Função para marcar/desmarcar a presença do aluno
  const alternarPresenca = (index) => {
    const novaLista = [...listaAlunos];

    novaLista[index].presente = !novaLista[index].presente;

    setListaAlunos(novaLista);
  };

  // Função que envia a chamada para o servidor
  const salvarChamada = async () => {
    setCarregando(true);

    try {
      if (!dadosAula || !dadosAula.id_aula) {
        console.error("Não encontramos o ID da aula.");
        return;
      }

      const dadosParaSalvar = listaAlunos.map((aluno) => {
        return {
          id_aula: dadosAula.id_aula,
          id_pessoa: aluno.id_pessoa || aluno.id || null,
          compareceu: aluno.presente,
        };
      });

      console.log("Dados enviados:", dadosParaSalvar);

      // Faz a requisição para salvar no banco de dados
      await api.post("/chamadas-aula", dadosParaSalvar);

      setModalAberto(false);
      alert("Chamada enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar chamada:", error);
      alert("Houve um erro ao enviar a chamada.");
    } finally {
      setCarregando(false);
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
          alunos={listaAlunos}
          onTogglePresenca={alternarPresenca}
        />
      </div>

      {/* BOTÕES DE AÇÃO */}
      <div className="flex justify-end gap-3 mt-6">
        <button className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors">
          Cancelar
        </button>

        <button
          className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#1E7A3C] hover:bg-[#165a2d] transition-colors shadow-md shadow-green-100/50 active:scale-[0.98]"
          onClick={() => setModalAberto(true)}
        >
          Salvar Chamada
        </button>
      </div>

      {/* MODAL DE CONFIRMAÇÃO */}
      <ModalConfirmacao
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        alunos={listaAlunos}
        onTogglePresenca={alternarPresenca}
        onConfirm={salvarChamada}
        isSending={carregando}
      />
    </section>
  );
}

export default CardPresenca;
