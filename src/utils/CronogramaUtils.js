const MS_DIA = 24 * 60 * 60 * 1000;

export function formatarDataLocal(data) {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
}

export function parseDataLocal(valor) {
  if (!valor) return null;
  const [ano, mes, dia] = valor.split("T")[0].split("-").map(Number);
  return new Date(ano, mes - 1, dia);
}

export function obterInicioSemana(data) {
  const inicio = new Date(data.getFullYear(), data.getMonth(), data.getDate());
  inicio.setDate(inicio.getDate() - ((inicio.getDay() + 6) % 7));
  return inicio;
}

export function calcularDatasDaSemana(data) {
  const inicio = obterInicioSemana(data);
  return Array.from({ length: 7 }, (_, indice) => {
    const dia = new Date(inicio);
    dia.setDate(inicio.getDate() + indice);
    return dia;
  });
}

export function calcularDatasDoMes(data) {
  const primeiroDia = new Date(data.getFullYear(), data.getMonth(), 1);
  const inicio = obterInicioSemana(primeiroDia);
  return Array.from({ length: 42 }, (_, indice) => {
    const dia = new Date(inicio);
    dia.setDate(inicio.getDate() + indice);
    return dia;
  });
}

export function adicionarDias(data, quantidade) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate() + quantidade);
}

export function obterTextoSemanaDoMes(datasDaSemana) {
  if (!datasDaSemana?.length) return { semanaTexto: "", mesAnoTexto: "" };
  const inicio = datasDaSemana[0];
  const fim = datasDaSemana[datasDaSemana.length - 1];
  const formatador = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });
  return {
    semanaTexto: `${inicio.toLocaleDateString("pt-BR")} – ${fim.toLocaleDateString("pt-BR")}`,
    mesAnoTexto: formatador.format(inicio),
  };
}

export function verificarConflitoProfessor(listaDeAulas, idInstrutor, data, hora, idAulaAtual) {
  const horaAlvo = Number(hora.substring(0, 2));
  return listaDeAulas.some(({ aula }) => {
    if (!aula?.data_aula || !aula?.hora_inicio) return false;
    const horaAula = Number(aula.hora_inicio.substring(0, 2));
    return aula.data_aula.split("T")[0] === data &&
      horaAula === horaAlvo &&
      Number(aula.id_instrutor) === Number(idInstrutor) &&
      Number(aula.id_aula) !== Number(idAulaAtual);
  });
}

export function obterSemanaAtualDoAno() {
  const hoje = new Date();
  return Math.ceil((hoje - new Date(hoje.getFullYear(), 0, 1)) / MS_DIA / 7) + 1;
}
