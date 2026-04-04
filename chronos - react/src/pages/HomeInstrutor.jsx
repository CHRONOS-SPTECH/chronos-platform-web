import Sidebar from "../components/homeInstrutor/Sidebar";
import Header from "../components/homeInstrutor/Header";
import ProfileCard from "../components/homeInstrutor/Profile";
import Acoes from "../components/homeInstrutor/Acoes";
import Cronograma from "../components/homeInstrutor/Cronograma";
import Eventos from "../components/homeInstrutor/Eventos";
import "../styles/HomeInstrutor.css";

function HomeInstrutor() {
  return (
    <div className="page">
      <Sidebar />

      <div className="main-wrap">
        <Header />

        <main className="content">
          <ProfileCard />

          <div className="left-col">
            <Acoes />
            <Cronograma />
          </div>

          <Eventos />
        </main>
      </div>
    </div>
  );
}

export default HomeInstrutor;