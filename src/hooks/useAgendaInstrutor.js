import { useCallback, useEffect, useMemo, useState } from "react";

import aulaService from "../services/aulaService";
import sessionService from "../services/sessionService";
import {
  adicionarDias,
  calcularDatasDaSemana,
  obterTextoSemanaDoMes,
} from "../utils/CronogramaUtils";

export default function useAgendaInstrutor() {
  const [semana, setSemana] = useState(0);
  const [datasDaSemana, setDatasDaSemana] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [instrutorInfo, setInstrutorInfo] = useState({ id: null, nome: "" });
  const [erro, setErro] = useState("");

  useEffect(() => {
    try {
      const dadosSessao = sessionService.getSession();
      const pessoa = dadosSessao?.usuario?.pessoa;

      const instrutorId = pessoa?.id_pessoa ?? dadosSessao?.usuario?.id_usuario;
      if (instrutorId) {
        setInstrutorInfo({
          id: instrutorId,
          nome: pessoa?.nome || "",
        });
      }
    } catch (error) {
      console.error("Erro ao carregar dados do instrutor:", error);
      setErro("Erro ao carregar informações do instrutor.");
    }
  }, []);

  useEffect(() => {
    const dataDeReferencia = adicionarDias(new Date(), semana * 7);
    setDatasDaSemana(calcularDatasDaSemana(dataDeReferencia));
  }, [semana]);

  const carregarAulasDoInstrutor = useCallback(async () => {
    if (!instrutorInfo.id) {
      setAulas([]);
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);
      setErro("");

      const aulasDetalhadas = await aulaService.listarTodasAulasDetalhadas();
      const aulasFiltradas = aulasDetalhadas.filter(
        (item) => Number(item?.aula?.id_instrutor) === Number(instrutorInfo.id),
      );

      setAulas(aulasFiltradas);
    } catch (error) {
      console.error("Erro ao carregar aulas do instrutor:", error);
      setErro("Erro ao carregar aulas.");
      setAulas([]);
    } finally {
      setCarregando(false);
    }
  }, [instrutorInfo.id]);

  useEffect(() => {
    carregarAulasDoInstrutor();
  }, [carregarAulasDoInstrutor]);

  const { semanaTexto, mesAnoTexto } = useMemo(
    () => obterTextoSemanaDoMes(datasDaSemana),
    [datasDaSemana],
  );

  return {
    semana,
    setSemana,
    datasDaSemana,
    aulas,
    carregando,
    instrutorInfo,
    erro,
    semanaTexto,
    mesAnoTexto,
    carregarAulasDoInstrutor,
  };
}
