import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Presenca";
import HomeInstrutor from "./pages/HomeInstrutor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HomeInstrutor />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
