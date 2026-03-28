import "../styles/login.css";
import LoginForm from "../components/LoginForm";
import imagemLogin from "../assets/imagemLogin.svg";
import logoChronos from "../assets/logoChronos.svg";

function Login(){
    return (
        <div className="container">
            <div className="esquerda">
                <img src={imagemLogin} alt="" className="imagem_login" />
            </div>

            <div className="direita">
                <div className="logo">
                    <img src={logoChronos} alt="" className="logoChronos" />
                </div>
                <LoginForm />
            </div>
        </div>
    )
}

export default Login;