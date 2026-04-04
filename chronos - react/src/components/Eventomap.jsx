import EventoCard from "../components/EventoCard";

const eventos = [
  {
    titulo: "Título - Evento",
    descricao: "Descrição do evento...",
    data: "30/03/2026"
  },
  {
    titulo: "Outro evento",
    descricao: "Mais detalhes...",
    data: "31/03/2026"
  }
];

<div className="eventos">
  {eventos.map((evento, index) => (
    <EventoCard
      key={index}
      titulo={evento.titulo}
      descricao={evento.descricao}
      data={evento.data}
    />
  ))}
</div>