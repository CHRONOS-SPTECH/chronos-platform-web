import { useEffect, useState } from "react";
import { ArrowLeft, CalendarPlus, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/homeSecretario/Header";
import eventoService from "../../services/EventoService";
import turmaService from "../../services/turmaService";
import { useToast } from "../../components/alert-toast/ToastProvider";
import { getEventoDraft, saveEventoDraft } from "../../utils/eventoDraftStorage";

const INITIAL_FORM = {
  titulo: "", id_categoria: "", id_secretaria: "", data_evento: "",
  hora_inicio_evento: "", hora_fim_evento: "", descricao: "", local: "", status: "PENDENTE",
  id_turmas: [], incluir_publico_externo: false,
};
const getErrorMessage = (error, fallback) => error?.response?.data?.message || error?.response?.data?.erro || fallback;
const getValue = (data, ...keys) => keys.map((key) => data?.[key]).find((value) => value !== undefined && value !== null) ?? "";
const toList = (response, ...keys) => {
  if (Array.isArray(response)) return response;
  for (const key of ["content", "data", ...keys]) {
    const value = response?.[key];
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
      const nested = toList(value, ...keys);
      if (nested.length) return nested;
    }
  }
  return [];
};
const isTurmaAtiva = (turma) => {
  const status = String(turma?.status_turma ?? turma?.statusTurma ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
  return ["NAOINICIADA", "EMANDAMENTO"].includes(status);
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
  const [turmas, setTurmas] = useState([]);
  const [turmasDropdownAberto, setTurmasDropdownAberto] = useState(false);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [categoriesResult, secretariasResult, turmasResult] = await Promise.allSettled([
        eventoService.getCategorias(),
        eventoService.getSecretarias(),
        turmaService.listarTurmas(),
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

      if (turmasResult.status === "fulfilled") {
        const turmasResponse = turmasResult.value;
        const turmasDisponiveis = toList(turmasResponse, "turmas");
        setTurmas(turmasDisponiveis.filter(isTurmaAtiva));
      } else {
        toast.error(getErrorMessage(turmasResult.reason, "Não foi possível carregar as turmas."));
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

  const handleChange = ({ target }) => setFormData((current) => ({ ...current, [target.name]: target.type === "checkbox" ? target.checked : target.value }));
  const handleTurmaChange = ({ target }) => setFormData((current) => ({
    ...current,
    id_turmas: target.checked
      ? [...current.id_turmas, Number(target.value)]
      : current.id_turmas.filter((idTurma) => idTurma !== Number(target.value)),
  }));
  const todasTurmasSelecionadas = turmas.length > 0 && turmas.every((turma) => formData.id_turmas.includes(Number(turma.id_turma)));
  const handleTodasTurmasChange = () => setFormData((current) => ({
    ...current,
    id_turmas: todasTurmasSelecionadas ? [] : turmas.map((turma) => Number(turma.id_turma)),
  }));
  const resumoTurmas = formData.id_turmas.length === 0
    ? "Nenhuma turma selecionada"
    : todasTurmasSelecionadas
      ? "Todas as turmas selecionadas"
      : `${formData.id_turmas.length} turma(s) selecionada(s)`;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.titulo.trim() || !formData.id_categoria || !formData.id_secretaria || !formData.data_evento || !formData.hora_inicio_evento || !formData.hora_fim_evento) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    if (formData.id_turmas.length === 0) {
      toast.error("Selecione pelo menos uma turma.");
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
        descricao: formData.descricao.trim(),
        local_evento: formData.local.trim(),
        id_turmas: formData.id_turmas,
        incluir_publico_externo: formData.incluir_publico_externo,
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

  const inputClass = "w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50";
  const labelClass = "text-xs font-black uppercase tracking-wider text-slate-500";
  const field = (label, name, type = "text", extra = {}) => <div className={extra.className || ""}><label className={labelClass} htmlFor={name}>{label}</label><input id={name} name={name} type={type} value={formData[name]} onChange={handleChange} className={inputClass} required={extra.required} /></div>;

  return <PageShell><button onClick={() => navigate(-1)} className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-blue-800"><ArrowLeft size={16} /> Voltar</button><div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5"><div className="relative border-b border-slate-700 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-800 px-5 py-6 text-white sm:px-8"><span className="absolute inset-x-0 top-0 h-1.5 bg-[#1E7A3C]" /><p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">Gestão de eventos</p><h1 className="mt-2 text-2xl font-black">{editing ? "Editar evento" : "Novo evento"}</h1><p className="mt-1 text-sm text-slate-300">Preencha os dados para organizar a programação.</p></div><div className="p-5 sm:p-8">{loading ? <p className="text-sm text-slate-500">Carregando evento...</p> : <form onSubmit={handleSubmit} className="space-y-5">
  <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
    <div className="mb-4"><h2 className="text-sm font-black text-slate-800">Sobre o evento</h2><p className="mt-1 text-xs text-slate-500">Defina o nome e uma descrição para apresentar a atividade.</p></div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{field("Título *", "titulo", "text", { required: true, className: "md:col-span-2" })}<div className="md:col-span-2"><label className={labelClass} htmlFor="descricao">Descrição</label><textarea id="descricao" name="descricao" rows="3" value={formData.descricao} onChange={handleChange} className={inputClass} /></div></div>
  </section>
  <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
    <div className="mb-4"><h2 className="text-sm font-black text-slate-800">Responsáveis e público</h2><p className="mt-1 text-xs text-slate-500">Escolha a classificação, a secretaria responsável e as turmas participantes.</p></div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2"><div><label className={labelClass} htmlFor="id_categoria">Categoria *</label><select id="id_categoria" name="id_categoria" value={formData.id_categoria} onChange={handleChange} className={inputClass} required><option value="">Selecione uma categoria</option>{categorias.map((item) => <option key={listId(item, "id_categoria", "idCategoria")} value={listId(item, "id_categoria", "idCategoria")}>{listName(item, "nome", "nome_categoria", "nomeCategoria")}</option>)}</select></div><div><label className={labelClass} htmlFor="id_secretaria">Secretaria *</label><select id="id_secretaria" name="id_secretaria" value={formData.id_secretaria} onChange={handleChange} className={inputClass} required><option value="">Selecione uma secretaria</option>{secretarias.map((item) => <option key={listId(item, "id_secretaria", "idSecretaria")} value={listId(item, "id_secretaria", "idSecretaria")}>{listName(item, "nome_secretaria", "nomeSecretaria", "nome")}</option>)}</select></div>
    <div className="relative md:col-span-2"><label className={labelClass} htmlFor="turmas-select">Turmas *</label><button id="turmas-select" type="button" aria-expanded={turmasDropdownAberto} onClick={() => setTurmasDropdownAberto((aberto) => !aberto)} className={`${inputClass} mt-1 flex items-center justify-between text-left`}><span>{resumoTurmas}</span><span aria-hidden="true">{turmasDropdownAberto ? "▲" : "▼"}</span></button>{turmasDropdownAberto && <div className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg">{turmas.length ? <><label className="flex cursor-pointer items-center gap-2 border-b border-slate-100 px-2 py-2 text-sm font-bold text-slate-700"><input type="checkbox" checked={todasTurmasSelecionadas} onChange={handleTodasTurmasChange} className="accent-green-700" />Todas</label>{turmas.map((turma) => <label key={turma.id_turma} className="flex cursor-pointer items-center gap-2 px-2 py-2 text-sm text-slate-700 hover:bg-slate-50"><input type="checkbox" value={turma.id_turma} checked={formData.id_turmas.includes(Number(turma.id_turma))} onChange={handleTurmaChange} className="accent-green-700" />{turma.nome_turma}</label>)}</> : <p className="px-2 py-2 text-sm text-slate-500">Nenhuma turma ativa disponível.</p>}</div>}</div>
    <label className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-700 md:col-span-2"><input type="checkbox" name="incluir_publico_externo" checked={formData.incluir_publico_externo} onChange={handleChange} className="accent-green-700" />Incluir público externo</label></div>
  </section>
  <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
    <div className="mb-4"><h2 className="text-sm font-black text-slate-800">Quando e onde</h2><p className="mt-1 text-xs text-slate-500">Informe a data, o horário e o local da atividade.</p></div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{field("Data *", "data_evento", "date", { required: true })}{field("Local", "local")}{field("Hora inicial *", "hora_inicio_evento", "time", { required: true })}{field("Hora final *", "hora_fim_evento", "time", { required: true })}<div><label className={labelClass} htmlFor="status">Status</label><select id="status" name="status" value={formData.status} onChange={handleChange} className={inputClass}><option value="PENDENTE">Pendente</option><option value="OFICIALIZADO">Oficializado</option><option value="CANCELADO">Cancelado</option></select></div></div>
  </section>
  <div className="flex justify-end gap-3 pt-1"><button type="button" onClick={() => navigate(-1)} disabled={saving} className="rounded-xl bg-slate-100 px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-200">Cancelar</button><button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-[#1E7A3C] px-5 py-3 text-xs font-bold text-white hover:bg-[#165a2d] disabled:opacity-60"><Save size={16} /> {saving ? "Salvando..." : "Salvar evento"}</button></div>
</form>}</div></div></PageShell>;
}

function PageShell({ children }) { return <div className="flex h-screen overflow-hidden bg-[#F8FAFC] font-sans antialiased"><Sidebar /><div className="flex min-w-0 flex-1 flex-col overflow-hidden"><Header titulo="Gestão Acadêmica" icone={CalendarPlus} /><main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8"><div className="mx-auto max-w-4xl">{children}</div></main></div></div>; }
