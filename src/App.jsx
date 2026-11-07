import { RouterProvider } from "react-router-dom";
import { routes } from "./provider/routes";
import { ToastProvider } from "./components/feedback/ToastProvider";

function App() {
  return (
    <ToastProvider>
      <RouterProvider router={routes} />
    </ToastProvider>
  );
}

export default App;
