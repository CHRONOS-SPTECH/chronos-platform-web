// src/components/Login/Alert.jsx
function Alert({ type, message }) {
  if (!message) return null;

  const styles = {
    error: "bg-red-50 text-red-600 border-red-100",
    success: "bg-green-50 text-green-600 border-green-100",
  };

  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 animate-fade-in">
      <div
        className={`p-4 rounded-2xl text-sm font-semibold border shadow-xl flex items-center gap-3 ${styles[type]}`}
      >
        <div
          className={`w-2.5 h-2.5 rounded-full animate-pulse ${type === "error" ? "bg-red-500" : "bg-green-500"}`}
        />
        {message}
      </div>
    </div>
  );
}

export default Alert;
