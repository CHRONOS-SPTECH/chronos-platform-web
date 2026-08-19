// eventoDraftStorage é um armazenamento temporário no navegador para 
// os campos que ainda não existem no banco:
// descricao
// local
// status



import { useEffect, useState } from "react";
import { ArrowLeft, CalendarPlus, Clock, MapPin, Pencil, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/homeSecretario/Header";
import ConfirmDeleteModal from "../../components/eventos/ConfirmDeleteModal";
import eventoService from "../../services/EventoService";
import { useToast } from "../../components/alert-toast/ToastProvider";
import { getEventoDraft } from "../../utils/eventoDraftStorage";

const getValue = (event, ...keys) => keys.map((key) => event?.[key]).find((value) => value !== undefined && value !== null && value !== "") || "Não informado";
const getErrorMessage = (error, fallback) => error?.response?.data?.message || error?.response?.data?.erro || fallback;
const formatDate = (value) => value === "Não informado" ? value : new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR");
const MOCK_EVENT_DETAILS = {
  status: "PENDENTE",
  descricao: "Evento acadêmico programado para a comunidade Chronos.",
  local: "Auditório principal",
};

export default function DetalhesEvento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [excluirAberto, setExcluirAberto] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    eventoService.getEventoById(id).then(setEvento).catch((error) => toast.error(getErrorMessage(error, "Não foi possível carregar o evento."))).finally(() => setLoading(false));
  }, [id]);

  const excluir = async () => {
    setExcluindo(true);
    try { await eventoService.deleteEvento(id); toast.success("Evento excluído com sucesso."); navigate("/eventos", { replace: true }); } catch (error) { toast.error(getErrorMessage(error, "Não foi possível excluir o evento.")); } finally { setExcluindo(false); setExcluirAberto(false); }
  };

  if (loading) return <PageShell><p className="text-sm text-slate-500">Carregando evento...</p></PageShell>;
  if (!evento) return <PageShell><p className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">Evento não encontrado.</p></PageShell>;
  const tags = Array.isArray(evento.tags) ? evento.tags : [];
  const draft = getEventoDraft(id);
  const statusValue = getValue(draft, "status") !== "Não informado" ? getValue(draft, "status") : getValue(evento, "status", "status_evento", "statusEvento");
  const descricaoValue = getValue(draft, "descricao") !== "Não informado" ? getValue(draft, "descricao") : getValue(evento, "descricao", "description");
  const localValue = getValue(draft, "local") !== "Não informado" ? getValue(draft, "local") : getValue(evento, "local", "local_evento", "localEvento");
  const status = statusValue === "Não informado" ? MOCK_EVENT_DETAILS.status : statusValue;
  const descricao = descricaoValue === "Não informado" ? MOCK_EVENT_DETAILS.descricao : descricaoValue;
  const local = localValue === "Não informado" ? MOCK_EVENT_DETAILS.local : localValue;
  return <PageShell><button onClick={() => navigate("/eventos")} className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#1E7A3C]"><ArrowLeft size={16} /> Voltar</button><article className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm"><div className="bg-[#1E7A3C] p-6 text-white sm:p-10"><span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest">{status}</span><h1 className="mt-5 max-w-3xl text-3xl font-black">{getValue(evento, "titulo")}</h1></div><div className="p-6 sm:p-10"><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"><Info label="Categoria" value={evento.categoria?.nome || getValue(evento, "categoria_nome", "categoriaNome")} /><Info label="Secretaria responsável" value={evento.secretaria?.nome_secretaria || getValue(evento, "secretaria_nome", "secretariaNome")} /><Info label="Data" value={formatDate(getValue(evento, "data_evento", "dataEvento"))} icon={CalendarPlus} /><Info label="Horário" value={`${getValue(evento, "hora_inicio_evento", "horaInicioEvento")} - ${getValue(evento, "hora_fim_evento", "horaFimEvento")}`} icon={Clock} /></div><div className="mt-8 grid gap-8 border-t border-slate-100 pt-8 lg:grid-cols-[1fr_280px]"><div><h2 className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">Descrição completa</h2><p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">{descricao}</p></div><div><h2 className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">Local e tags</h2><p className="flex items-center gap-2 text-sm font-semibold text-slate-700"><MapPin size={16} className="text-[#1E7A3C]" /> {local}</p><div className="mt-4 flex flex-wrap gap-2">{tags.length ? tags.map((tag) => <span key={tag.label || tag} className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-600">{tag.label || tag}</span>) : <span className="text-sm text-slate-400">Nenhuma tag cadastrada.</span>}</div></div></div><div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-6"><button onClick={() => navigate(`/eventos/editar/${id}`)} className="flex items-center gap-2 rounded-xl bg-[#1E7A3C] px-4 py-3 text-xs font-bold text-white hover:bg-[#165a2d]"><Pencil size={15} /> Editar evento</button><button onClick={() => setExcluirAberto(true)} className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-50"><Trash2 size={15} /> Excluir evento</button></div></div></article><ConfirmDeleteModal aberto={excluirAberto} evento={evento} carregando={excluindo} onConfirm={excluir} onCancel={() => setExcluirAberto(false)} /></PageShell>;
}

function Info({ label, value, icon: Icon }) { return <div className="rounded-2xl bg-slate-50 p-4"><span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</span><p className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-700">{Icon && <Icon size={15} className="text-[#1E7A3C]" />} {value}</p></div>; }
function PageShell({ children }) { return <div className="flex h-screen overflow-hidden bg-[#F8FAFC] font-sans antialiased"><Sidebar /><div className="flex min-w-0 flex-1 flex-col overflow-hidden"><Header titulo="Gestão Acadêmica" icone={CalendarPlus} /><main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8"><div className="mx-auto max-w-5xl">{children}</div></main></div></div>; }
