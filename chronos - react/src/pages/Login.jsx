import LoginForm from "../components/LoginForm";
import imagemLogin from "../assets/imagemLogin.svg";
import logoChronos from "../assets/logoChronos.svg";

function Login() {
  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Lado Esquerdo: Imagem Limpa */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          src={imagemLogin}
          alt="Login background"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Lado Direito: Área de Login */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Logo centralizada acima do card */}
          <div className="mb-8 flex flex-col items-center">
            <img src={logoChronos} alt="Logo Chronos" className="h-16 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wider">
              Acessar conta
            </h1>
            <p className="text-gray-500 text-sm">
              Insira suas credenciais para continuar.
            </p>
          </div>

          {/* O Card do Formulário */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
