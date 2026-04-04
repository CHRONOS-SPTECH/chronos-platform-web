const subItems = ["Chamada do Dia", "Minhas Turmas", "Minha Agenda"];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-box">H</div>
        <span>Henrique</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-item active">
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          Home
        </div>

        <p className="sidebar-section-label">Acadêmico</p>

        <div className="nav-item active">
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
          Controle de Frequência
        </div>

        {subItems.map((item) => (
          <div key={item} className="nav-sub-item">{item}</div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="nav-item">
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sair
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;