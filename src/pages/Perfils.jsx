import logoCronos from "../assets/logoChronos.svg";
import Card from "../components/perfis/Card";
import usePerfis from "../hooks/usePerfis";

function Perfils() {
  const { perfisDisponiveis } = usePerfis();

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

      <div className="flex gap-6 flex-wrap justify-center">
        {perfisDisponiveis.map((perfil) => (
          <Card
            key={perfil.id}
            tipo={perfil.tipo}
            descricao={perfil.descricao}
            badge={perfil.badge}
            rota={perfil.rota}
          />
        ))}

        {perfisDisponiveis.length === 0 && (
          <p className="text-sm text-red-500">
            Nenhum perfil de acesso encontrado para este usuário.
          </p>
        )}
      </div>
    </div>
  );
}

export default Perfils;
