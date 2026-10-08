import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const campo =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700";
export default function AulaDialog({
  item,
  editando,
  onClose,
  onEditar,
  onSalvar,
  turmas,
  professores,
  temas,
}) {
  const navigate = useNavigate();
  const aula = item?.aula;
  const [form, setForm] = useState({});
  const chamadaFeita = Boolean(item?.chamadaFeita ?? aula?.chamadaFeita);
  useEffect(() => {
    if (!aula) return;
    setForm({
      id_turma: String(aula.id_turma),
      id_instrutor: String(aula.id_instrutor),
      id_tema: String(aula.id_tema),
      data_aula: aula.data_aula?.split("T")[0] || "",
      hora_inicio: aula.hora_inicio?.slice(0, 5) || "",
      hora_fim: aula.hora_fim?.slice(0, 5) || "",
      statusAula: aula.statusAula || "Agendada",
    });
  }, [aula]);
  if (!item) return null;
  const alterar = (chave, valor) =>
    setForm((atual) => ({ ...atual, [chave]: valor }));
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">
              Detalhes da aula
            </p>
            <h2 className="mt-1 text-xl font-black text-slate-800">
              {item.tema?.titulo_tema || "Aula"}
            </h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            aria-label="Fechar detalhes da aula"
            title="Fechar"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <X size={18} />
          </button>
        </div>
        {!editando ? (
          <>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Turma", item.turma?.nome_turma],
                ["Instrutor", item.instrutor?.nome],
                [
                  "Data",
                  form.data_aula
                    ? new Date(`${form.data_aula}T12:00:00`).toLocaleDateString(
                        "pt-BR",
                      )
                    : "Pendente",
                ],
                [
                  "Horário",
                  form.hora_inicio
                    ? `${form.hora_inicio}${form.hora_fim ? ` – ${form.hora_fim}` : ""}`
                    : "Não alocada",
                ],
                [
                  "Status",
                  chamadaFeita
                    ? "Presença registrada"
                    : aula.statusAula || "Presença pendente",
                ],
              ].map(([nome, valor]) => (
                <div key={nome} className="rounded-xl bg-slate-50 p-3">
                  <dt className="text-[10px] font-bold uppercase text-slate-400">
                    {nome}
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-700">
                    {valor || "—"}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              {form.data_aula && (
                <button
                  onClick={() =>
                    navigate(`/presenca/${aula.id_turma}/${aula.id_aula}`)
                  }
                  className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white"
                >
                  Abrir presença
                </button>
              )}
              <button
                onClick={onEditar}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white"
              >
                Editar aula
              </button>
            </div>
          </>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSalvar(aula.id_aula, {
                id_turma: Number(form.id_turma),
                id_instrutor: Number(form.id_instrutor),
                id_tema: Number(form.id_tema),
                ...(chamadaFeita
                  ? {}
                  : {
                      data_aula: form.data_aula || null,
                      hora_inicio: form.hora_inicio || null,
                      hora_fim: form.hora_fim || null,
                    }),
                statusAula: form.statusAula,
              });
            }}
            className="space-y-3"
          >
            <label className="block text-xs font-bold text-slate-500">
              Turma
              <select
                className={campo}
                value={form.id_turma || ""}
                onChange={(e) => alterar("id_turma", e.target.value)}
              >
                {turmas.map((v) => (
                  <option key={v.id_turma} value={v.id_turma}>
                    {v.nome_turma}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-bold text-slate-500">
              Tema
              <select
                className={campo}
                value={form.id_tema || ""}
                onChange={(e) => alterar("id_tema", e.target.value)}
              >
                {temas.map((v) => (
                  <option key={v.id_tema} value={v.id_tema}>
                    {v.titulo_tema}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-bold text-slate-500">
              Instrutor
              <select
                className={campo}
                value={form.id_instrutor || ""}
                onChange={(e) => alterar("id_instrutor", e.target.value)}
              >
                {professores.map((v) => (
                  <option key={v.id_pessoa} value={v.id_pessoa}>
                    {v.nome}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-3 gap-3">
              <label className="text-xs font-bold text-slate-500">
                Data
                <input
                  className={campo}
                  type="date"
                  disabled={chamadaFeita}
                  value={form.data_aula || ""}
                  onChange={(e) => alterar("data_aula", e.target.value)}
                />
              </label>
              <label className="text-xs font-bold text-slate-500">
                Início
                <input
                  className={campo}
                  type="time"
                  disabled={chamadaFeita}
                  value={form.hora_inicio || ""}
                  onChange={(e) => alterar("hora_inicio", e.target.value)}
                />
              </label>
              <label className="text-xs font-bold text-slate-500">
                Fim
                <input
                  className={campo}
                  type="time"
                  disabled={chamadaFeita}
                  value={form.hora_fim || ""}
                  onChange={(e) => alterar("hora_fim", e.target.value)}
                />
              </label>
            </div>
            {chamadaFeita && (
              <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
                A chamada já foi registrada; data e horários estão bloqueados.
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border px-4 py-2 text-sm font-semibold"
              >
                Cancelar
              </button>
              <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white">
                Salvar alterações
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
