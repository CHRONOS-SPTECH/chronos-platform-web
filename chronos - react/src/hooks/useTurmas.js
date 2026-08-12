import { useEffect, useState, useMemo } from "react";
import turmaService from "../services/turmaService";
import {
  extrairMensagemErro,
  mapApiTurmaToUi,
  getTurmaId,
} from "../utils/turmaUtils";

export default function useTurmas() {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [salvando, setSalvando] = useState(false);

  const carregarTurmas = async () => {
    try {
      setLoading(true);
      setError("");
      const dados = await turmaService.listarTurmas();
      setTurmas(Array.isArray(dados) ? dados : []);
    } catch (err) {
      console.error("Erro ao carregar turmas (hook):", err);
      setError(
        extrairMensagemErro(err, "Não foi possível carregar as turmas."),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTurmas();
  }, []);

  const turmasUi = useMemo(() => turmas.map(mapApiTurmaToUi), [turmas]);

  const salvarTurma = async (dadosTurma, turmaEmEdicao = null) => {
    try {
      setSalvando(true);
      setError("");

      if (turmaEmEdicao?.id_turma || turmaEmEdicao?.id) {
        const turmaId = turmaEmEdicao?.id_turma || turmaEmEdicao?.id;
        const turmaAtualizada = await turmaService.atualizarTurma(
          turmaId,
          dadosTurma,
        );
        setTurmas((ant) =>
          ant.map((item) =>
            getTurmaId(item) === turmaId ? turmaAtualizada : item,
          ),
        );
        return turmaAtualizada;
      } else {
        const turmaCriada = await turmaService.criarTurma(dadosTurma);
        setTurmas((ant) => [...ant, turmaCriada]);
        return turmaCriada;
      }
    } catch (err) {
      console.error("Erro ao salvar turma (hook):", err);
      setError(extrairMensagemErro(err, "Erro ao salvar turma."));
      throw err;
    } finally {
      setSalvando(false);
    }
  };

  const excluirTurma = async (idTurma) => {
    try {
      setError("");
      await turmaService.excluirTurma(idTurma);
      setTurmas((ant) => ant.filter((item) => getTurmaId(item) !== idTurma));
    } catch (err) {
      console.error("Erro ao excluir turma (hook):", err);
      const msg = extrairMensagemErro(err, "Erro ao excluir turma.");
      setError(msg);
      throw err;
    }
  };

  return {
    turmas,
    turmasUi,
    loading,
    error,
    salvando,
    carregarTurmas,
    salvarTurma,
    excluirTurma,
  };
}
