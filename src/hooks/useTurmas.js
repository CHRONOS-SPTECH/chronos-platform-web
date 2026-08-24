import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [dadosAlunosPorTurma, setDadosAlunosPorTurma] = useState([]);

  const carregarTurmas = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    carregarTurmas();
  }, [carregarTurmas]);

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
        setTurmas((listaAtualTurmas) =>
          listaAtualTurmas.map((item) =>
            getTurmaId(item) === turmaId ? turmaAtualizada : item,
          ),
        );
        return turmaAtualizada;
      } else {
        const turmaCriada = await turmaService.criarTurma(dadosTurma);
        setTurmas((listaAtualTurmas) => [...listaAtualTurmas, turmaCriada]);
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
      setTurmas((listaAtualTurmas) =>
        listaAtualTurmas.filter((item) => getTurmaId(item) !== idTurma),
      );
    } catch (err) {
      console.error("Erro ao excluir turma (hook):", err);
      const msg = extrairMensagemErro(err, "Erro ao excluir turma.");
      setError(msg);
      throw err;
    }
  };

  async function buscarAlunos(id) {
    try {
      const alunosTurma = await turmaService.buscarAlunosPorTurma(id);
      setDadosAlunosPorTurma(alunosTurma);
      return alunosTurma;
    } catch (err) {
      console.error("Erro ao buscar alunos:", err);
      throw err;
    }
  }

  return {
    turmas,
    turmasUi,
    loading,
    error,
    salvando,
    dadosAlunosPorTurma,
    carregarTurmas,
    salvarTurma,
    excluirTurma,
    buscarAlunos,
  };
}
