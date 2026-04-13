function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Lucas</h2>

      <nav>
        <p className="menu-title">ACADÊMICO</p>
        <ul>
          <li className="active">Controle de Frequência</li>
          <li>Chamada do Dia</li>
          <li>Minhas Turmas</li>
          <li>Minha Agenda</li>
        </ul>
      </nav>

      <button className="logout">Sair</button>
    </aside>
  );
}

export default Sidebar;