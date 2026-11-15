import { useCallback, useEffect, useState } from "react";

import { dashboardService } from "../services/dashboardService";

export default function useDashboardEngajamento() {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarDashboard = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");
      setDados(await dashboardService.getEngajamentoAtividades());
    } catch (error) {
      console.error("Erro ao carregar engajamento das atividades:", error);
      setErro("Não foi possível carregar os indicadores de engajamento.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarDashboard();
  }, [carregarDashboard]);

  return {
    carregando,
    erro,
    carregarDashboard,
    metaPresenca: dados?.meta_presenca ?? 70,
    impacto: dados?.impacto_eventos ?? {
      total_participantes: 0,
      adesao_media: 0,
    },
    publicoExterno: dados?.publico_externo ?? {
      alcance: 0,
      convertidos: 0,
      taxa_matricula: 0,
    },
    secretariaDestaque: dados?.secretaria_destaque ?? null,
    performanceEventos: dados?.performance_eventos ?? [],
    adesaoCategorias: dados?.adesao_categorias ?? [],
    performancePublico: dados?.performance_publico ?? null,
  };
}
