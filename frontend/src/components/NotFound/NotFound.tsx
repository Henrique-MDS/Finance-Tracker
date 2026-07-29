import { Link } from "react-router-dom";


export function NotFoundPage() {

  
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
            <h1 className="text-5xl">404</h1>
            <p>Oops! Página não encontrada.</p>
            <p>Não sabemos como chegou aqui, talvez a url incorreta?</p>
            <Link to={"/"} className="text-[#2CAE60]">Clique aqui para voltar ao Dashboard</Link>
        </div>
    </div>
  );
}

export default NotFoundPage;