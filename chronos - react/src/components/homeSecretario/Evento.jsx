

const eventos = [
  { id: 1, data: "30/03/2026", titulo: "Título - Evento", descricao: "Descrição do Evento, Regras e Como Participar", link: "Em caso de forma, ou meios de inscrição" },
  { id: 2, data: "30/03/2026", titulo: "Título - Evento", descricao: "Descrição do Evento, Regras e Como Participar", link: "Em caso de forma, ou meios de inscrição" },
  { id: 3, data: "30/03/2026", titulo: "Título - Evento", descricao: "Descrição do Evento, Regras e Como Participar", link: "Em caso de forma, ou meios de inscrição" },
  { id: 4, data: "30/03/2026", titulo: "Título - Evento", descricao: "Descrição do Evento, Regras e Como Participar", link: "Em caso de forma, ou meios de inscrição" },
];

function Evento() {
  return (
    <section className="flex flex-col w-full">
      
      
    <p className="font-bold text-[#00000084] ">PRÓXIMOS EVENTOS</p>
      {/* Semana */}
      <div className="bg-white w-auto">
      <div className="bg-[#2d7a2d] text-white rounded-md px-4 py-2 text-[13px] font-semibold mb-2">
        Semana do dia - 29/03 à 05/04
      </div>

      {eventos.map((ev, index) => (
        <div
          key={ev.id}
          className={`
            bg-white rounded-[10px] px-4 py-3 mb-2 
            border border-[#e8ecf0] 
            hover:shadow-md transition
            ${index === 0 ? "border-2 border-[#2d7a2d]" : ""}
          `}
        >
          
          {/* topo */}
          <div className="flex items-center justify-between mb-1">
            
            <span className="bg-[#e8f5e9] text-[#2d7a2d] text-[9px] font-bold px-2 py-[2px] rounded-full uppercase tracking-wide">
              Evento
            </span>

            <span className="bg-[#1a4a1a] text-white text-[9px] font-semibold px-2 py-[2px] rounded-full">
              {ev.data}
            </span>

          </div>

          {/* titulo */}
          <p className="text-[12px] font-bold text-[#1a2e1a] mb-1">
            {ev.titulo}
          </p>

          {/* descricao */}
          <p className="text-[10.5px] text-gray-500 mb-1 leading-snug">
            {ev.descricao}
          </p>

          {/* link */}
          <p className="text-[10px] text-[#2d7a2d] font-medium">
            <span className="text-gray-400 font-normal">Links: </span>
            {ev.link}
          </p>

        </div>
    
      ))}
      </div>
    </section>
  );
}

export default Evento;