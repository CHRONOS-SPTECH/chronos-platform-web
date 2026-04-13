import TabelaAlunos from "./TabelaAlunos";

function CardPresenca({ alunos }) {
  return (
    <section className="card">

      {/* HEADER */}
      <div className="card-header">
        <div className="user-info">
          <div className="avatar"></div>

          <div className="user-text">
            <h2>Lucas Alberto</h2>
            <span>Instrutor Acadêmico</span>
          </div>
        </div>

        <div className="box-info">
          <p><strong>Turma Iniciada:</strong> Janeiro/2026</p>
          <p><strong>Previsão:</strong> Setembro/2026</p>
        </div>
      </div>

      {/* CORPO */}
      <div className="card-body">
        <h3 className="titulo">
          Frequência Diária - Turma 3 | Aula 2 (Filosofia antiga)
        </h3>

        <TabelaAlunos alunos={alunos} />

        <div className="buttons">
          <button className="cancelar">Cancelar</button>
          <button className="salvar">Salvar Chamada</button>
        </div>
      </div>

    </section>
  );
}

export default CardPresenca;