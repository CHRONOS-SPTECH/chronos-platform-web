import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";

function Alert({ type, message }) {
  if (!message) return null;

  const styles = {
    error: {
      container: "border-red-200 bg-red-50 text-red-900",
      icon: CircleAlert,
      title: "Erro",
    },
    success: {
      container: "border-green-200 bg-green-50 text-green-900",
      icon: CircleCheck,
      title: "Sucesso",
    },
    info: {
      container: "border-blue-200 bg-blue-50 text-blue-900",
      icon: Info,
      title: "Informação",
    },
    warning: {
      container: "border-amber-200 bg-amber-50 text-amber-900",
      icon: TriangleAlert,
      title: "Atenção",
    },
  };

  const style = styles[type] || styles.info;
  const Icon = style.icon;

  return (
    <div className="pointer-events-none fixed left-1/2 top-4 z-[100] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 px-0 animate-fade-in sm:left-auto sm:right-4 sm:translate-x-0">
      <div
        role={type === "error" ? "alert" : "status"}
        aria-live={type === "error" ? "assertive" : "polite"}
        className={`flex items-start gap-3 rounded-2xl border p-4 shadow-xl ${style.container}`}
      >
        <Icon className="mt-0.5 shrink-0" size={20} aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-sm font-bold">{style.title}</p>
          <p className="mt-1 break-words text-sm font-medium leading-5">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Alert;
