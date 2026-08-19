import { useEffect, useState } from "react";
import { CalendarPlus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/homeSecretario/Header";
import ModulosControle from "../../components/turmas/ModuloControle";
import EventoCard from "../../components/eventos/EventoCard";
import ConfirmDeleteModal from "../../components/eventos/ConfirmDeleteModal";
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

  const confirmarExclusao = async () => {
    if (!eventoSelecionado) return;
    setExcluindo(true);
    try {
      await eventoService.deleteEvento(getId(eventoSelecionado));
      setEventos((current) => current.filter((evento) => getId(evento) !== getId(eventoSelecionado)));
      toast.success("Evento excluído com sucesso.");
    } catch (requestError) {
      toast.error(getErrorMessage(requestError, "Não foi possível excluir o evento."));
    } finally {
      setExcluindo(false);
      setEventoSelecionado(null);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] font-sans antialiased">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header titulo="Gestão Acadêmica" icone={CalendarPlus} />
        <main className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar sm:px-8 sm:py-8">
          <div className="mb-8 flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-end">
            <ModulosControle moduloAtivo="Eventos" />
            <button onClick={() => navigate("/eventos/novo")} className="flex items-center justify-center gap-2 rounded-2xl bg-[#1E7A3C] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-green-100/50 transition-all hover:bg-[#165a2d] active:scale-[0.98]"><Plus size={16} /> Novo Evento</button>
          </div>
          <div className="mb-6 flex items-center justify-between px-1"><h1 className="text-sm font-black uppercase tracking-widest text-slate-400">Eventos e Oficinas Programadas</h1><span className="text-xs font-bold text-slate-400">{eventos.length} registros encontrados</span></div>
          {loading && <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm font-semibold text-slate-500">Carregando eventos...</div>}
          {!loading && error && <div className="flex items-center justify-between rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button onClick={carregarEventos} className="font-bold underline">Tentar novamente</button></div>}
          {!loading && !error && eventos.length === 0 && <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-500">Nenhum evento cadastrado.</div>}
          {!loading && !error && eventos.length > 0 && <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">{eventos.map((evento) => <EventoCard key={getId(evento)} evento={evento} onExcluir={setEventoSelecionado} />)}</div>}
        </main>
        <ConfirmDeleteModal aberto={Boolean(eventoSelecionado)} evento={eventoSelecionado} carregando={excluindo} onConfirm={confirmarExclusao} onCancel={() => setEventoSelecionado(null)} />
      </div>
    </div>
  );
}
