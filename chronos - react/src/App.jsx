import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import HomeInstrutor from "./pages/HomeInstrutor";
import HomeSecretario from "./pages/HomeSecretario";
import Presenca from "./pages/Presenca";
import Perfils from "./pages/Perfils";

import GestaoUsuarios from "./pages/GestaoUsuarios";

function App() {
  return (
    <BrowserRouter>
      {/* <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/instrutor" element={<HomeInstrutor />} />
        <Route path="/secretario" element={<HomeSecretario />} />
        <Route path="/presenca" element={<Presenca />} />
        <Route path="/perfis" element={<Perfils />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes> */}

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/instrutor" element={<HomeInstrutor />} />
        <Route path="/secretario" element={<HomeSecretario />} />
        <Route path="/presenca" element={<Presenca />} />
        <Route path="/perfis" element={<Perfils />} />

        <Route path="/turmas" element={<div>Tela de Turmas</div>} />
        <Route path="/agenda" element={<div>Tela de Agenda</div>} />
        <Route path="/eventos" element={<div>Tela de Eventos</div>} />

        <Route path="/usuarios" element={<GestaoUsuarios />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
