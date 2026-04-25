import perfil from "../../assets/perfil.svg"

/**
 * Props:
 * - nome: string
 * - cargo: string
 * - avatar: string (caminho da imagem, opcional — usa perfil.svg por padrão)
 */
function Profile({ nome = "Henrique", cargo = "Secretario", avatar = perfil }) {
    return (
        <div className="flex flex-row gap-3 items-center">
            <img src={avatar} alt="Perfil" className="w-12 h-12 rounded-full" />
            <div className="flex flex-col">
                <h2 className="font-bold">{nome}</h2>
                <span className="w-24 bg-[#228B22] text-white rounded-2xl text-center text-sm">{cargo}</span>
            </div>
        </div>
    )
}

export default Profile;