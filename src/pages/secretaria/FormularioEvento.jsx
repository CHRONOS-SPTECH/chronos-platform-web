import { useEffect, useState } from "react";
import { ArrowLeft, CalendarPlus, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/homeSecretario/Header";
import eventoService from "../../services/EventoService";
import { useToast } from "../../components/alert-toast/ToastProvider";
import { getEventoDraft, saveEventoDraft } from "../../utils/eventoDraftStorage";

const INITIAL_FORM = {
  titulo: "", id_categoria: "", id_secretaria: "", data_evento: "",
  hora_inicio_evento: "", hora_fim_evento: "", descricao: "", local: "", status: "PENDENTE",
};
const getErrorMessage = (error, fallback) => error?.response?.data?.message || error?.response?.data?.erro || fallback;
const getValue = (data, ...keys) => keys.map((key) => data?.[key]).find((value) => value !== undefined && value !== null) ?? "";
const toList = (response, ...keys) => {
  if (Array.isArray(response)) return response;
  for (const key of ["content", "data", ...keys]) {
    if (Array.isArray(response?.[key])) return response[key];
  }
  return [];
};
const listId = (item, primary, fallback) => item?.[primary] ?? item?.[fallback] ?? item?.id;
const listName = (item, ...keys) => keys.map((key) => item?.[key]).find(Boolean) || "Sem nome";

function toFormData(evento) {
  const draft = getEventoDraft(evento?.id_evento ?? evento?.idEvento ?? evento?.id);
  return {
    titulo: getValue(evento, "titulo"),
    id_categoria: getValue(evento, "id_categoria", "idCategoria"),
    id_secretaria: getValue(evento, "id_secretaria", "idSecretaria"),
    data_evento: getValue(evento, "data_evento", "dataEvento"),
    hora_inicio_evento: String(getValue(evento, "hora_inicio_evento", "horaInicioEvento")).slice(0, 5),
    hora_fim_evento: String(getValue(evento, "hora_fim_evento", "horaFimEvento")).slice(0, 5),
    descricao: getValue(draft, "descricao") || getValue(evento, "descricao", "description"),
    local: getValue(draft, "local") || getValue(evento, "local", "local_evento", "localEvento"),
    status: getValue(draft, "status") || getValue(evento, "status", "status_evento", "statusEvento") || "PENDENTE",
  };
}

export default function FormularioEvento() {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const editing = Boolean(id);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [categorias, setCategorias] = useState([]);
  const [secretarias, setSecretarias] = useState([]);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [categoriesResult, secretariasResult] = await Promise.allSettled([
        eventoService.getCategorias(),
        eventoService.getSecretarias(),
      ]);

      if (categoriesResult.status === "fulfilled") {
        const categoriesResponse = categoriesResult.value;
        setCategorias(toList(categoriesResponse, "categorias", "categoriasAtividade"));
      } else {
        toast.error(getErrorMessage(categoriesResult.reason, "Não foi possível carregar as categorias."));
      }

      if (secretariasResult.status === "fulfilled") {
        const secretariasResponse = secretariasResult.value;
        setSecretarias(toList(secretariasResponse, "secretarias"));
      } else {
        toast.error(getErrorMessage(secretariasResult.reason, "Não foi possível carregar as secretarias."));
      }

      if (editing) {
        try {
          setFormData(toFormData(await eventoService.getEventoById(id)));
        } catch (requestError) {
          toast.error(getErrorMessage(requestError, "Não foi possível carregar o evento."));
        }
      }

      setLoading(false);
    };
    load();
  }, [editing, id]);

  const handleChange = ({ target }) => setFormData((current) => ({ ...current, [target.name]: target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.titulo.trim() || !formData.id_categoria || !formData.id_secretaria || !formData.data_evento || !formData.hora_inicio_evento || !formData.hora_fim_evento) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    if (formData.hora_fim_evento <= formData.hora_inicio_evento) {
      toast.error("A hora final deve ser maior que a hora inicial.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        titulo: formData.titulo,
        id_categoria: Number(formData.id_categoria),
        id_secretaria: Number(formData.id_secretaria),
        data_evento: formData.data_evento,
        hora_inicio_evento: formData.hora_inicio_evento,
        hora_fim_evento: formData.hora_fim_evento,
      };
      const saved = editing ? await eventoService.updateEvento(id, payload) : await eventoService.createEvento(payload);
      const savedId = id || saved?.id_evento || saved?.idEvento || saved?.id;
      saveEventoDraft(savedId, { descricao: formData.descricao, local: formData.local, status: formData.status });
      toast.success(editing ? "Evento atualizado com sucesso." : "Evento criado com sucesso.");
      navigate(editing ? `/eventos/${id}` : "/eventos", { replace: true, state: { evento: saved } });
    } catch (requestError) {
      toast.error(getErrorMessage(requestError, "Não foi possível salvar o evento."));
    } finally { setSaving(false); }
  };

  const inputClass = "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#1E7A3C] focus:ring-2 focus:ring-green-100 disabled:bg-slate-50";
  const labelClass = "text-xs font-black uppercase tracking-wider text-slate-500";
  const field = (label, name, type = "text", extra = {}) => <div className={extra.className || ""}><label className={labelClass} htmlFor={name}>{label}</label><input id={name} name={name} type={type} value={formData[name]} onChange={handleChange} className={inputClass} required={extra.required} /></div>;

  return <PageShell><button onClick={() => navigate(-1)} className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#1E7A3C]"><ArrowLeft size={16} /> Voltar</button><div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-8"><div className="mb-8 border-b border-slate-100 pb-5"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1E7A3C]">Gestão de eventos</p><h1 className="mt-2 text-2xl font-black text-slate-800">{editing ? "Editar evento" : "Novo evento"}</h1></div>{loading ? <p className="text-sm text-slate-500">Carregando evento...</p> : <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">{field("Título *", "titulo", "text", { required: true, className: "md:col-span-2" })}<div><label className={labelClass} htmlFor="id_categoria">Categoria *</label><select id="id_categoria" name="id_categoria" value={formData.id_categoria} onChange={handleChange} className={inputClass} required><option value="">Selecione uma categoria</option>{categorias.map((item) => <option key={listId(item, "id_categoria", "idCategoria")} value={listId(item, "id_categoria", "idCategoria")}>{listName(item, "nome", "nome_categoria", "nomeCategoria")}</option>)}</select></div><div><label className={labelClass} htmlFor="id_secretaria">Secretaria *</label><select id="id_secretaria" name="id_secretaria" value={formData.id_secretaria} onChange={handleChange} className={inputClass} required><option value="">Selecione uma secretaria</option>{secretarias.map((item) => <option key={listId(item, "id_secretaria", "idSecretaria")} value={listId(item, "id_secretaria", "idSecretaria")}>{listName(item, "nome_secretaria", "nomeSecretaria", "nome")}</option>)}</select></div>{field("Data *", "data_evento", "date", { required: true })}{field("Hora inicial *", "hora_inicio_evento", "time", { required: true })}{field("Hora final *", "hora_fim_evento", "time", { required: true })}{field("Local", "local")}<div><label className={labelClass} htmlFor="status">Status</label><select id="status" name="status" value={formData.status} onChange={handleChange} className={inputClass}><option value="PENDENTE">Pendente</option><option value="OFICIALIZADO">Oficializado</option><option value="CANCELADO">Cancelado</option></select></div><div className="md:col-span-2"><label className={labelClass} htmlFor="descricao">Descrição</label><textarea id="descricao" name="descricao" rows="4" value={formData.descricao} onChange={handleChange} className={inputClass} /></div><div className="flex justify-end gap-3 border-t border-slate-100 pt-5 md:col-span-2"><button type="button" onClick={() => navigate(-1)} disabled={saving} className="rounded-xl bg-slate-100 px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-200">Cancelar</button><button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-[#1E7A3C] px-5 py-3 text-xs font-bold text-white hover:bg-[#165a2d] disabled:opacity-60"><Save size={16} /> {saving ? "Salvando..." : "Salvar evento"}</button></div></form>}</div></PageShell>;
}

function PageShell({ children }) { return <div className="flex h-screen overflow-hidden bg-[#F8FAFC] font-sans antialiased"><Sidebar /><div className="flex min-w-0 flex-1 flex-col overflow-hidden"><Header titulo="Gestão Acadêmica" icone={CalendarPlus} /><main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8"><div className="mx-auto max-w-4xl">{children}</div></main></div></div>; }
