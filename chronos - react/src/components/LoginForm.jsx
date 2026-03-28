import Input from "./Input";
import Button from "./Button";
import "../styles/login.css";


function LoginForm(){
    return(
        <div className="login_forms">
            
            
            <Input type="email" placeholder="Email"/>
            <Input type="password" placeholder="Senha"/>

            <p>Esqueceu sua senha?</p>

            <Button text="Entrar"/>
        </div>
    )
}

export default LoginForm;