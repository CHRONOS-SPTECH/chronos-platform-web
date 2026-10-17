import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  LayoutGrid,
} from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import useSidebar from "../../hooks/useSidebar";

const CLASSE_ITEM =
  "flex min-h-10 w-full items-center rounded-lg px-3 text-left text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white";

export default function Sidebar() {
  const {
    config,
    location,
    navigate,
    abertos,
    alternarSecao,
    abrirItemMenu,
    recolhido,
    alternarRecolhimento,
  } = useSidebar();
  const [menuFlutuante, setMenuFlutuante] = useState(null);
  const fecharTimer = useRef(null);
  const expandido = !recolhido;
  const paginaInicialAtiva = location.pathname === config.dashboardPath;
  const secaoFlutuante = menuFlutuante
    ? config.secoes[menuFlutuante.indice]
    : null;

  const abrirMenuFlutuante = (event, indice) => {
    if (!recolhido) return;
    window.clearTimeout(fecharTimer.current);
    const limites = event.currentTarget.getBoundingClientRect();
    const alturaEstimada = Math.min(
      300,
      76 + config.secoes[indice].itens.length * 42,
    );
    setMenuFlutuante({
      indice,
      esquerda: Math.min(limites.right + 10, window.innerWidth - 270),
      topo: Math.max(
        10,
        Math.min(limites.top, window.innerHeight - alturaEstimada - 10),
      ),
    });
  };

  const agendarFechamento = () => {
    window.clearTimeout(fecharTimer.current);
    fecharTimer.current = window.setTimeout(() => setMenuFlutuante(null), 180);
  };

  useEffect(() => () => window.clearTimeout(fecharTimer.current), []);

  const renderizarItem = (item, indice) => {
    const itemAtivo = Boolean(item.rota && location.pathname === item.rota);
    return (
      <button
        key={`${item.nome}-${indice}`}
        type="button"
        aria-current={itemAtivo ? "page" : undefined}
        onClick={() => {
          setMenuFlutuante(null);
          abrirItemMenu(item);
        }}
        className={`${CLASSE_ITEM} ${
          itemAtivo
            ? "bg-white font-semibold text-[#075b2a]"
            : "text-white/95 hover:bg-white/15 hover:text-white"
        }`}
      >
        <span className="flex size-7 shrink-0 items-center justify-center text-current" aria-hidden="true">
          {item.icone}
        </span>
        <span className="min-w-0 flex-1">{item.nome}</span>
        {itemAtivo && (
          <span className="ml-2 size-1.5 shrink-0 rounded-full bg-emerald-700" />
        )}
      </button>
    );
  };

  return (
    <>
      <aside
        className={`relative z-[45] flex h-screen shrink-0 flex-col bg-[#075b2a] text-white shadow-lg shadow-emerald-950/10 transition-[width] duration-200 ease-out ${
          expandido ? "w-72" : "w-[76px]"
        }`}
      >
        <button
          type="button"
          onClick={alternarRecolhimento}
          aria-label={recolhido ? "Expandir menu lateral" : "Recolher menu lateral"}
          aria-pressed={recolhido}
          title={recolhido ? "Expandir menu" : "Recolher menu"}
          className="absolute -right-3 top-5 z-30 flex size-7 items-center justify-center rounded-full border-2 border-[#075b2a] bg-[#0b7135] text-white shadow-md transition-colors hover:bg-[#128343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#075b2a]"
        >
          {recolhido ? (
            <ChevronRight size={15} aria-hidden="true" />
          ) : (
            <ChevronLeft size={15} aria-hidden="true" />
          )}
        </button>

        <div
          className={`flex h-[76px] shrink-0 items-center border-b border-white/15 ${
            expandido ? "gap-3 px-5" : "justify-center px-2"
          }`}
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
            <LayoutGrid size={20} strokeWidth={2.2} aria-hidden="true" />
          </div>
          {expandido && (
            <div className="min-w-0">
              <p className="text-sm font-extrabold tracking-[0.12em] text-white">
                CHRONOS
              </p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-100/75">
                Plataforma acadêmica
              </p>
            </div>
          )}
        </div>

        <nav
          aria-label="Navegação principal"
          className="sidebar-scrollbar flex-1 overflow-y-auto overflow-x-hidden px-3 py-5"
        >
          {expandido && (
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-100/65">
              Menu
            </p>
          )}
          <button
            type="button"
            title={!expandido ? "Home" : undefined}
            aria-current={paginaInicialAtiva ? "page" : undefined}
            onClick={() => navigate(config.dashboardPath)}
            className={`flex min-h-11 w-full items-center rounded-xl text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-800 ${
              expandido ? "gap-3 px-3" : "justify-center px-0"
            } ${
              paginaInicialAtiva
                ? "bg-white font-semibold text-emerald-800 shadow-sm"
                : "text-white/95 hover:bg-white/15 hover:text-white"
            }`}
          >
            <Home
              size={19}
              strokeWidth={paginaInicialAtiva ? 2.4 : 2}
              className="shrink-0"
              aria-hidden="true"
            />
            {expandido && <span>Home</span>}
            {paginaInicialAtiva && expandido && (
              <span className="ml-auto size-1.5 rounded-full bg-emerald-600" />
            )}
          </button>

          <div className="my-5 h-px bg-white/20" />

          <div className="flex flex-col gap-2">
            {config.secoes.map((secao, indice) => {
              const secaoAtiva = secao.itens.some(
                (item) => item.rota && location.pathname === item.rota,
              );
              const secaoAberta = Boolean(abertos[indice]) || secaoAtiva;
              const popupAtivo = menuFlutuante?.indice === indice;

              return (
                <section key={secao.titulo} aria-label={secao.titulo}>
                  {expandido && (
                    <p className="mb-1 px-3 pt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-100/65">
                      {secao.label}
                    </p>
                  )}
                  <button
                    type="button"
                    title={!expandido ? secao.titulo : undefined}
                    aria-expanded={expandido ? secaoAberta : popupAtivo}
                    aria-haspopup={recolhido ? "true" : undefined}
                    onMouseEnter={(event) => abrirMenuFlutuante(event, indice)}
                    onMouseLeave={recolhido ? agendarFechamento : undefined}
                    onFocus={(event) => abrirMenuFlutuante(event, indice)}
                    onClick={(event) => {
                      if (recolhido) {
                        abrirMenuFlutuante(event, indice);
                        return;
                      }
                      alternarSecao(indice);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") setMenuFlutuante(null);
                    }}
                    className={`flex min-h-11 w-full items-center rounded-xl text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-800 ${
                      expandido ? "gap-3 px-3" : "justify-center px-0"
                    } ${
                      secaoAtiva || popupAtivo
                        ? "bg-white/20 text-white"
                        : "text-white/95 hover:bg-white/15 hover:text-white"
                    }`}
                  >
                    <span
                      className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white"
                      aria-hidden="true"
                    >
                      {secao.icone}
                    </span>
                    {expandido && (
                      <>
                        <span className="min-w-0 flex-1 text-[13px] font-semibold">
                          {secao.titulo}
                        </span>
                        <ChevronDown
                          size={15}
                          className={`shrink-0 text-emerald-100/75 transition-transform ${
                            secaoAberta ? "rotate-0" : "-rotate-90"
                          }`}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </button>

                  {expandido && secaoAberta && (
                    <div className="ml-[27px] mt-1 flex flex-col gap-0.5 border-l border-white/30 pl-3">
                      {secao.itens.map(renderizarItem)}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </nav>

      </aside>

      {recolhido && secaoFlutuante && menuFlutuante &&
        createPortal(
          <div
            role="group"
            aria-label={`Links de ${secaoFlutuante.titulo}`}
            onMouseEnter={() => window.clearTimeout(fecharTimer.current)}
            onMouseLeave={agendarFechamento}
            onKeyDown={(event) => {
              if (event.key === "Escape") setMenuFlutuante(null);
            }}
            style={{
              left: menuFlutuante.esquerda,
              top: menuFlutuante.topo,
            }}
          className="fixed z-[100] w-64 overflow-hidden rounded-2xl border border-white/15 bg-[#075b2a] text-white shadow-xl shadow-emerald-950/30 ring-1 ring-black/10"
          >
            <div className="border-b border-white/20 bg-white/10 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-100">
                {secaoFlutuante.label}
              </p>
              <p className="mt-0.5 text-sm font-bold text-white">
                {secaoFlutuante.titulo}
              </p>
            </div>
            <div className="flex max-h-[65vh] flex-col gap-1 overflow-y-auto p-2">
              {secaoFlutuante.itens.map(renderizarItem)}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
