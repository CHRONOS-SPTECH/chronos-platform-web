function TabelaAlunos({ alunos }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Nome do Aluno</th>
          <th>Percent. Presença</th>
          <th>CPF do Aluno</th>
          <th>Presença</th>
          <th>Ações</th>
        </tr>
      </thead>

      <tbody>
        {alunos.map((aluno, index) => (
          <tr key={index}>
            <td>{aluno.nome}</td>
            <td>{aluno.presenca}%</td>
            <td>{aluno.cpf}</td>

            <td>
              <div className="progress">
                <div style={{ width: `${aluno.presenca}%` }}></div>
              </div>
              <span>{aluno.presenca}%</span>
            </td>

            <td>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </td>

            <td className="acoes">Ver Detalhes</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TabelaAlunos;