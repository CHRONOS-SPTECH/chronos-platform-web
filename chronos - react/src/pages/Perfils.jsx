import logoCronos from "../assets/logoChronos.svg";
import Card from "../components/perfis/Card";

const perfis = [
  {
    id: 1,
    tipo: "Administrador",
    descricao: "Gestão total de alunos, turmas, finanças e voluntários.",
    badge: "Acesso Total",
    rota: "/administrador",
  },
  {
    id: 2,
    tipo: "Instrutor",
    descricao: "Lançamento de presenças, aulas e desempenho do aluno",
    badge: "Acesso Docente",
    rota: "/instrutor",
  },
  {
    id: 3,
    tipo: "Secretária",
    descricao: "Matrículas, documentos e atendimento ao aluno.",
    badge: "Acesso Operacional",
    rota: "/secretario",
  },
];

function Perfils() {
  return (
    <div className="min-h-screen bg-[#eef1f6] flex flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-3 mt-6">
        <img src={logoCronos} alt="LogoChronos" className="w-28 mb-4" />
        <h1 className="text-2xl font-bold text-[#1E7A3C]">
          Bem-vindo ao Chronos
        </h1>
      </div>
      <p className="text-gray-500">
        Selecione o perfil de acesso para continuar
      </p>

      {/* cards */}
      <div className="flex gap-6 ">
        {perfis.map((perfil) => (
          <Card
            key={perfil.id}
            tipo={perfil.tipo}
            descricao={perfil.descricao}
            badge={perfil.badge}
            rota={perfil.rota}
          />
        ))}
      </div>
    </div>
  );
}

export default Perfils;
