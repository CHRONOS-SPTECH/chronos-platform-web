import { RouterProvider } from "react-router-dom";
import { routes } from "./provider/routes";


function App() {
  return <RouterProvider router={routes} />;
}

export default App;
