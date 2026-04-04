function Acoes() {
  return (
    <section>
      <p className="section-title">Minhas Ações</p>

      <button className="btn-presenca">
        <div className="btn-presenca-icon">
          {/* icon de check */}
          <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        Marcar Presença Agora
      </button>

      <div className="atalhos">
        <div className="atalho-card">
          <div className="atalho-icon">
            <svg width="26" height="26" fill="none" stroke="#2d7a2d" strokeWidth="1.8" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <span>Minha Agenda</span>
        </div>

        <div className="atalho-card">
          <div className="atalho-icon">
            <svg width="28" height="28" fill="none" stroke="#2d7a2d" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <span>Minhas Turmas</span>
        </div>
      </div>
    </section>
  );
}

export default Acoes;