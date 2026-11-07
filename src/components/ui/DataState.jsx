import LoaderCircle from "lucide-react/icons/loader-circle";

export function LoadingState({ message = "Carregando dados..." }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="flex min-h-40 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 text-sm font-semibold text-slate-600 shadow-sm">
      <LoaderCircle size={20} className="animate-spin text-emerald-700" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="flex flex-col justify-between gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center">
      <span>{message}</span>
      {onRetry && <button type="button" onClick={onRetry} className="shrink-0 font-bold underline">Tentar novamente</button>}
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <p className="font-semibold text-slate-700">{title}</p>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
