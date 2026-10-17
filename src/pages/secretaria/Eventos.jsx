import { useEffect, useState } from "react";
import { CalendarPlus, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/homeSecretario/Header";
import ModulosControle from "../../components/turmas/ModuloControle";
import EventoCard from "../../components/eventos/EventoCard";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import eventoService from "../../services/EventoService";
import { useToast } from "../../components/alert-toast/ToastProvider";

const getId = (evento) => evento?.id_evento ?? evento?.idEvento ?? evento?.id;
const getErrorMessage = (error, fallback) => error?.response?.data?.message || error?.response?.data?.erro || fallback;

export default function Eventos() {
  const navigate = useNavigate();
  const toast = useToast();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [excluindo, setExcluindo] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");

  const carregarEventos = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await eventoService.getEventos();
      setEventos(Array.isArray(response) ? response : response?.content || response?.eventos || []);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Não foi possível carregar os eventos."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregarEventos(); }, []);

  const eventosFiltrados = eventos.filter((evento) => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    const status = String(evento.status ?? evento.status_evento ?? evento.statusEvento ?? "PENDENTE").toUpperCase();
    const texto = [evento.titulo, evento.descricao, evento.local, evento.local_evento, evento.localEvento].filter(Boolean).join(" ").toLocaleLowerCase("pt-BR");
    const correspondeBusca = !termo || texto.includes(termo);
    const correspondeStatus = filtroStatus === "Todos" || (filtroStatus === "Pendentes" && status.startsWith("PENDENTE")) || (filtroStatus === "Oficializados" && status.startsWith("OFICIAL")) || (filtroStatus === "Cancelados" && status.startsWith("CANCEL"));
    return correspondeBusca && correspondeStatus;
  });

  const confirmarExclusao = async () => {
    if (!eventoSelecionado) return;
    setExcluindo(true);
    try {
      await eventoService.deleteEvento(getId(eventoSelecionado));
      setEventos((current) => current.filter((evento) => getId(evento) !== getId(eventoSelecionado)));
      toast.success("Evento excluído com sucesso.");
      setEventoSelecionado(null);
    } catch (requestError) {
      toast.error(getErrorMessage(requestError, "Não foi possível excluir o evento."));
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] font-sans antialiased">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header titulo="Gestão Acadêmica" icone={CalendarPlus} />
        <main className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar sm:px-8 sm:py-8">
          <div className="mb-8 flex flex-col justify-between gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
            <ModulosControle moduloAtivo="Eventos" />
            <div className="flex items-center gap-4"><div className="hidden border-l border-slate-200 pl-4 text-right sm:block"><p className="text-2xl font-black text-slate-900">{eventos.length}</p><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">eventos</p></div><button onClick={() => navigate("/eventos/novo")} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E7A3C] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm shadow-emerald-900/15 transition-all hover:bg-[#165a2d] active:scale-[0.98] sm:w-auto"><Plus size={16} /> Novo Evento</button></div>
          </div>
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div><h1 className="text-sm font-black uppercase tracking-widest text-slate-800">Eventos e oficinas</h1><p className="mt-1 text-xs text-slate-500">Pesquise pela programação e filtre por situação.</p></div>
              <span className="text-xs font-semibold text-slate-500">{eventosFiltrados.length} de {eventos.length} registros</span>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Buscar por título, local ou descrição..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100" /></label>
              <label className="relative flex items-center sm:w-52"><SlidersHorizontal size={15} className="pointer-events-none absolute left-3 text-slate-400" /><select value={filtroStatus} onChange={(event) => setFiltroStatus(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"><option>Todos</option><option>Pendentes</option><option>Oficializados</option><option>Cancelados</option></select></label>
            </div>
          </section>
          {loading && <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm font-semibold text-slate-500">Carregando eventos...</div>}
          {!loading && error && <div className="flex items-center justify-between rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button onClick={carregarEventos} className="font-bold underline">Tentar novamente</button></div>}
          {!loading && !error && eventosFiltrados.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center"><p className="font-semibold text-slate-700">{eventos.length ? "Nenhum evento corresponde aos filtros" : "Nenhum evento cadastrado"}</p><p className="mt-1 text-sm text-slate-500">Tente outra busca ou crie um novo evento.</p></div>}
          {!loading && !error && eventosFiltrados.length > 0 && <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">{eventosFiltrados.map((evento) => <EventoCard key={getId(evento)} evento={evento} onExcluir={setEventoSelecionado} />)}</div>}
        </main>
        <ConfirmDialog aberto={Boolean(eventoSelecionado)} titulo="Excluir evento?" mensagem={`Deseja realmente excluir o evento “${eventoSelecionado?.titulo || ""}”? Essa ação não poderá ser desfeita.`} carregando={excluindo} onConfirm={confirmarExclusao} onCancel={() => setEventoSelecionado(null)} confirmText="Excluir evento" variant="danger" />
      </div>
    </div>
  );
}
