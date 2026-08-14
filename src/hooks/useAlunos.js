import { useCallback, useEffect, useState } from "react";
import alunoService from "../services/alunoService";

export default function useAlunos() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [salvando, setSalvando] = useState(false);

  const carregarAlunos = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const dados = await alunoService.listarAlunos();
      setAlunos(Array.isArray(dados) ? dados : []);
    } catch (err) {
      console.error("Erro ao carregar alunos (hook):", err);
      setError(
        err?.response?.data?.message || "Não foi possível carregar os alunos.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarAlunos();
  }, [carregarAlunos]);

  const salvarAluno = async (
    dadosPessoa,
    dadosEndereco,
    alunoEmEdicao = null,
  ) => {
    try {
      setSalvando(true);
      if (alunoEmEdicao) {
        const id = alunoEmEdicao.id_pessoa || alunoEmEdicao.id;
        const alunoAtualizado = await alunoService.atualizarAluno(
          id,
          dadosPessoa,
        );

        let alunoFinal = { ...alunoEmEdicao, ...alunoAtualizado };

        if (dadosEndereco) {
          if (dadosEndereco.id) {
            const enderecoAtu = await alunoService.atualizarEndereco(
              dadosEndereco.id,
              { ...dadosEndereco, id_pessoa: id },
            );
            alunoFinal.endereco = enderecoAtu;
          } else {
            const enderecoCriado = await alunoService.cadastrarEndereco({
              ...dadosEndereco,
              id_pessoa: id,
            });
            alunoFinal.endereco = enderecoCriado;
          }
        }

        setAlunos((listaAtualAlunos) =>
          listaAtualAlunos.map((aluno) =>
            aluno.id_pessoa === id ? alunoFinal : aluno,
          ),
        );
        return alunoFinal;
      } else {
        const alunoCriado = await alunoService.cadastrarAluno(dadosPessoa);
        let alunoFinal = { ...alunoCriado };

        if (dadosEndereco) {
          const enderecoCriado = await alunoService.cadastrarEndereco({
            ...dadosEndereco,
            id_pessoa: alunoCriado.id_pessoa,
          });
          alunoFinal.endereco = enderecoCriado;
        }

        setAlunos((listaAtualAlunos) => [alunoFinal, ...listaAtualAlunos]);
        return alunoFinal;
      }
    } catch (err) {
      console.error("Erro ao salvar aluno (hook):", err);
      throw err;
    } finally {
      setSalvando(false);
    }
  };

  const excluirAluno = async (idPessoa) => {
    try {
      await alunoService.excluirAluno(idPessoa);
      setAlunos((listaAtualAlunos) =>
        listaAtualAlunos.filter((item) => item.id_pessoa !== idPessoa),
      );
    } catch (err) {
      console.error("Erro ao excluir aluno (hook):", err);
      throw err;
    }
  };

  return {
    alunos,
    loading,
    error,
    carregando: loading,
    salvando,
    carregarAlunos,
    salvarAluno,
    excluirAluno,
  };
}
