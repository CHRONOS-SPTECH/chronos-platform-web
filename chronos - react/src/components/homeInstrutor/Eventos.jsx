const eventos = [
  { id: 1, data: "30/03/2026", titulo: "Título - Evento", descricao: "Descrição do Evento, Regras e Como Participar", link: "Em caso de forma, ou meios de inscrição" },
  { id: 2, data: "30/03/2026", titulo: "Título - Evento", descricao: "Descrição do Evento, Regras e Como Participar", link: "Em caso de forma, ou meios de inscrição" },
  { id: 3, data: "30/03/2026", titulo: "Título - Evento", descricao: "Descrição do Evento, Regras e Como Participar", link: "Em caso de forma, ou meios de inscrição" },
  { id: 4, data: "30/03/2026", titulo: "Título - Evento", descricao: "Descrição do Evento, Regras e Como Participar", link: "Em caso de forma, ou meios de inscrição"},
];

function Eventos() {
  return (
    <section className="eventos">
      <p className="section-title">Próximos Eventos</p>

      <div className="eventos-semana">Semana do dia - 29/03 à 05/04</div>

      {eventos.map((ev) => (
        <div key={ev.id} className="evento-card">
          <div className="evento-top">
            <span className="evento-tag">Evento</span>
            <span className="evento-data">{ev.data}</span>
          </div>
          <p className="evento-titulo">{ev.titulo}</p>
          <p className="evento-desc">{ev.descricao}</p>
          <p className="evento-link">
            <span className="evento-link-label">Links: </span>
            {ev.link}
          </p>
        </div>
      ))}
    </section>
  );
}

export default Eventos;