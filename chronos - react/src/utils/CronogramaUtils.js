// src/utils/CronogramaUtils.js

// 1. Calcula os 7 dias completos da semana (Segunda a Domingo)
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
  // loop alterado para 7 para cobrir sábado (6) e domingo (7)
  for (let i = 0; i < 7; i++) {
    let dataCalculada = new Date(inicioSemana);
    dataCalculada.setDate(inicioSemana.getDate() + i);
    dias.push(dataCalculada);
  }
  return dias;
}

// 2. Transforma o número da semana (1-52) em texto humano (Ex: 3ª Semana de Março)
export function obterTextoSemanaDoMes(datasDaSemana) {
  if (!datasDaSemana || datasDaSemana.length === 0) return "";

  const dataReferencia = datasDaSemana[0]; // Usa a segunda-feira como base
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

  // Calcula matematicamente a ordem da semana dentro daquele mês específico (1ª a 5ª)
  const numeroSemanaDoMes = Math.ceil(diaDoMes / 7);

  return `${numeroSemanaDoMes}ª Semana de ${meses[numeroMes]} de ${ano}`;
}

// 3. Valida se o professor já está ocupado em outra turma no mesmo dia e horário
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

    return (
      dataAulaFormatada === dataFormatada &&
      item.aula.hora_inicio === horaInicio &&
      item.aula.id_instrutor === idInstrutor &&
      item.aula.id_aula !== idAulaAtual
    );
  });
}
