import { useCallback, useEffect, useMemo, useState } from "react";

import { dashboardService } from "../services/dashboardService";

export default function useDashboardAcademica() {
  const [resumo, setResumo] = useState(null);
  const [dadosGenero, setDadosGenero] = useState(null);
  const [dadosFaixaEtaria, setDadosFaixaEtaria] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarDashboard = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      const [resumoCarregado, generoCarregado, faixaEtariaCarregada] =
        await Promise.all([
          dashboardService.getResumo(),
          dashboardService.getGenero(),
          dashboardService.getFaixaEtaria(),
        ]);

      setResumo(resumoCarregado);
      setDadosGenero(generoCarregado);
      setDadosFaixaEtaria(faixaEtariaCarregada);
    } catch (error) {
      console.error("Erro ao carregar dashboard acadêmico:", error);
      setErro("Erro ao carregar dados acadêmicos.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarDashboard();
  }, [carregarDashboard]);

  const obterEstiloPorGenero = useCallback((genero) => {
    const valorGenero = genero.toLowerCase();

    if (valorGenero.includes("mulh") || valorGenero.includes("femin")) {
      return "bg-green-100 text-green-700 border-green-200";
    }

    if (valorGenero.includes("hom") || valorGenero.includes("masc")) {
      return "bg-slate-100 text-slate-700 border-slate-200";
    }

    return "bg-cyan-100 text-cyan-700 border-cyan-200";
  }, []);

  const totalPessoas = resumo?.comunidade_academica?.total_pessoas ?? 0;
  const membros = resumo?.comunidade_academica?.membros ?? 0;
  const provacionistas = resumo?.comunidade_academica?.provacionistas ?? 0;
  const externos = resumo?.comunidade_academica?.publico_externo ?? 0;
  const ativos = resumo?.engajamento_voluntario?.membros_ativos ?? 0;

  const indicadores = useMemo(() => {
    const membrosPercentual = totalPessoas ? (membros / totalPessoas) * 100 : 0;
    const provacionistasPercentual = totalPessoas
      ? (provacionistas / totalPessoas) * 100
      : 0;
    const externosPercentual = totalPessoas
      ? (externos / totalPessoas) * 100
      : 0;
    const engajamentoPercentual = totalPessoas
      ? Math.round((ativos / totalPessoas) * 100)
      : 0;

    return {
      membrosPercentual,
      provacionistasPercentual,
      externosPercentual,
      engajamentoPercentual,
    };
  }, [ativos, externos, membros, provacionistas, totalPessoas]);

  return {
    resumo,
    dadosGenero,
    dadosFaixaEtaria,
    carregando,
    erro,
    totalPessoas,
    membros,
    provacionistas,
    externos,
    ativos,
    indicadores,
    generoDistribuicao: dadosGenero?.distribuicao_genero ?? [],
    faixaEtariaDistribuicao: dadosFaixaEtaria?.faixas_etarias ?? [],
    carregarDashboard,
    obterEstiloPorGenero,
  };
}
