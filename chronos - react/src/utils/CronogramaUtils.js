export function calcularDatasDaSemana(semana, ano) {
  const dataSimples = new Date(ano, 0, 1 + (semana - 1) * 7);
  const diaDaSemana = dataSimples.getDay();
  const inicioSemana = dataSimples;

  if (diaDaSemana <= 4) {
    inicioSemana.setDate(dataSimples.getDate() - dataSimples.getDay() + 1);
  } else {
    inicioSemana.setDate(dataSimples.getDate() + 8 - dataSimples.getDay());
  }

  let dias = [];
  for (let i = 0; i < 7; i++) {
    let dataCalculada = new Date(inicioSemana);
    dataCalculada.setDate(inicioSemana.getDate() + i);
    dias.push(dataCalculada);
  }
  return dias;
}

export function obterTextoSemanaDoMes(datasDaSemana) {
  if (!datasDaSemana || datasDaSemana.length === 0) {
    return { semanaTexto: "", mesAnoTexto: "" };
  }

  const dataReferencia = datasDaSemana[0];
  const diaDoMes = dataReferencia.getDate();
  const numeroMes = dataReferencia.getMonth();
  const ano = dataReferencia.getFullYear();

  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const numeroSemanaDoMes = Math.ceil(diaDoMes / 7);

  return {
    semanaTexto: `${numeroSemanaDoMes}ª Semana`,
    mesAnoTexto: `${meses[numeroMes]} de ${ano}`,
  };
}

export function verificarConflitoProfessor(
  listaDeAulas,
  idInstrutor,
  dataFormatada,
  horaInicio,
  idAulaAtual,
) {
  return listaDeAulas.some((item) => {
    if (!item.aula.data_aula || !item.aula.hora_inicio) return false;

    const dataAulaFormatada = item.aula.data_aula.split("T")[0];
    const horaAulaFormatada = item.aula.hora_inicio.substring(0, 5);
    const horaAlvoFormatada = horaInicio.substring(0, 5);

    return (
      dataAulaFormatada === dataFormatada &&
      horaAulaFormatada === horaAlvoFormatada &&
      item.aula.id_instrutor === idInstrutor &&
      item.aula.id_aula !== idAulaAtual
    );
  });
}

export function obterSemanaAtualDoAno() {
  const hoje = new Date();
  const primeiroDiaDoAno = new Date(hoje.getFullYear(), 0, 1);
  const diasPassados = Math.floor(
    (hoje - primeiroDiaDoAno) / (24 * 60 * 60 * 1000),
  );

  return Math.ceil((diasPassados + primeiroDiaDoAno.getDay() + 1) / 7);
}
