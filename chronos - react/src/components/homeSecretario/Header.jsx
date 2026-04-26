import { Home } from "lucide-react";

function Header({ titulo = "Home", icone: Icone = Home }) {
  return (
    <header className="w-full flex items-center justify-between gap-3 px-6 bg-white shadow-sm h-[68px]">
      <div className="flex flex-row items-center gap-3">
        <Icone size={20} />
        <h3>{titulo}</h3>
      </div>
      <p className="text-black">Sab, 18 de abril de 2026</p>
    </header>
  );
}

export default Header;
