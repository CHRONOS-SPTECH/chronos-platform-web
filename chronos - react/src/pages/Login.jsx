import LoginForm from "../components/LoginForm";
import imagemLogin from "../assets/imagemLogin.svg";
import logoChronos from "../assets/logoChronos.svg";

function Login() {
  return (
    <div className="flex h-screen w-full bg-[#F1F5F9]">
      <div className="hidden lg:block lg:w-1/2">
        <img
          src={imagemLogin}
          alt="Login background"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-4 flex flex-col items-center">
            <img src={logoChronos} alt="Logo Chronos" className="h-16 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 uppercase">
              Bem-vindo de volta!
            </h1>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
