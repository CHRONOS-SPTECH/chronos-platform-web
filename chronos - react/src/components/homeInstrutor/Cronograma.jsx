const aulas = [
  { id: 1, titulo: "Aula 1 - Filosofia antiga", horario: "10h - 12h", status: "concluida" },
  { id: 2, titulo: "Aula 2 - Filosofia antiga", horario: "10h - 12h", status: "andamento" },
  { id: 3, titulo: "Aula 3 - Filosofia antiga", horario: "10h - 12h", status: "pendente" },
  { id: 4, titulo: "Aula 4 - Filosofia antiga", horario: "10h - 12h", status: "pendente" },
];

const statusConfig = {
  concluida: { label: "Concluída", icon: "✓" },
  andamento: { label: "andamento", icon: "▶" },
  pendente:  { label: "pendente",  icon: null },
};

function Cronograma() {
  return (
    <section>
      <p className="section-title">Cronograma do Dia</p>

      <div className="cronograma-header">
        <span>Hoje - Sex, 03 de abril</span>
        <span className="cronograma-count">{aulas.length} aulas</span>
      </div>

      {aulas.map((aula, idx) => {
        const cfg = statusConfig[aula.status];
        return (
          <div key={aula.id} className="aula-row">
            <div className={`aula-num status-${aula.status}`}>
              {cfg.icon || idx + 1}
            </div>
            <span className="aula-titulo">{aula.titulo}</span>
            <span className="aula-horario">{aula.horario}</span>
            <span className={`aula-badge status-${aula.status}`}>
              {cfg.label}
            </span>
          </div>
        );
      })}
    </section>
  );
}

export default Cronograma;