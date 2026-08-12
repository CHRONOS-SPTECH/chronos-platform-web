import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TabelaAlunos from "./TabelaAlunos";
import ModalConfirmacao from "./ModalConfirmacao";
import { useToast } from "../alert-toast/ToastProvider";
import { BookOpen } from "lucide-react";
import aulaService from "../../services/aulaService";

function CardPresenca({ alunos, dadosAula }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [modalAberto, setModalAberto] = useState(false);
  const chamadaJaFeita = Boolean(dadosAula?.chamadaFeita);
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!alunos) return;

    const estadoInicial = alunos.map((aluno) => ({
      ...aluno,
      presente: aluno.presente ?? aluno.compareceu ?? false,
      percentual_presenca: aluno.percentual_presenca ?? 0,
    }));
    setLista(estadoInicial);
  }, [alunos]);

  const alternarPresenca = (idx) => {
    const novaLista = [...lista];
    const novoValor = !novaLista[idx].presente;
    novaLista[idx].presente = novoValor;
    setLista(novaLista);
  };

  const salvarChamada = async () => {
    const idAula = dadosAula?.aula?.id_aula;
    if (!idAula) return console.error("ID da aula não encontrado.");

    setCarregando(true);
    try {
      const dadosChamada = {
        id_aula: idAula,
        alunos: lista.map((aluno) => ({
          id_pessoa: aluno.id_pessoa,
          compareceu: aluno.presente,
        })),
      };

      await aulaService.salvarChamadaEmLote(dadosChamada);
      setModalAberto(false);
      toast.success("Chamada enviada com sucesso!");
      setTimeout(() => navigate("/instrutor"), 2500);
    } catch (err) {
      console.error("Erro ao enviar chamada:", err);
      toast.error("Houve um erro ao enviar a chamada.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <section className="overflow-hidden h-auto animate-in fade-in duration-500">
      {/* Cabeçalho do Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
        <div className="flex items-center gap-2.5 text-slate-700">
          <BookOpen size={18} className="text-slate-400" />
          <h3 className="text-sm font-bold tracking-tight">
            Aula #{dadosAula?.aula?.id_aula || "N/A"}:{" "}
            <span className="text-slate-500 font-medium">
              {dadosAula?.tema?.titulo_tema || "Sem Título de Tema"}
            </span>
          </h3>
        </div>
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
          Lista de Frequência Diária
        </span>
      </div>

      {/* Tabela de Alunos */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <TabelaAlunos
          alunos={lista}
          onTogglePresenca={alternarPresenca}
          visualizarChamada={chamadaJaFeita}
        />
      </div>

      {/* Botões de Ação */}
      {!chamadaJaFeita && (
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
            onClick={() => navigate("/instrutor")}
          >
            Cancelar
          </button>
          <button
            className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#1E7A3C] hover:bg-[#165a2d] transition-colors shadow-md shadow-green-100/50 active:scale-[0.98]"
            onClick={() => setModalAberto(true)}
          >
            Salvar Chamada
          </button>
        </div>
      )}

      {/* Modal de Confirmação Final */}
      <ModalConfirmacao
        aberto={modalAberto}
        fecharModal={() => setModalAberto(false)}
        alunos={lista}
        onTogglePresenca={alternarPresenca}
        confirmarChamada={salvarChamada}
        carregando={carregando}
      />
    </section>
  );
}

export default CardPresenca;
