import { useState } from "react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { getUserLogin } from "../../Utils/getUserLogin";
import { Link, useNavigate } from "react-router-dom";

export function LogInPage() {

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    let navigate = useNavigate();

    const getCredentials = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.placeholder == "Nome") {
            setName(e.target.value);
        } else if(e.target.placeholder == "Senha") {
            setPassword(e.target.value);
        }
    }

    const logFunc = async () => {
        if(!name  || !password){
            toast.dismiss();
            toast.error("Todos os campos deve estar preenchidos", {
                duration: 1500,
                position: "top-center",
            });
            return;
        }
        

        if(name.length < 5){
            toast.dismiss();
            toast.error("Nome deve conter no mínimo 5 digitos", {
                duration: 1500,
                position: "top-center",
            });
            return;
        }

        if(password.length < 5){
            toast.dismiss();
            toast.error("Senha deve conter no mínimo 5 digitos", {
                duration: 1500,
                position: "top-center",
            });
            return;
        }
        
        const returnLogIn = await getUserLogin(name, password);
        
        if(returnLogIn.success){
            toast.dismiss();
            toast.success(returnLogIn.message, {
                duration: 1500,
                position: "top-center",
            });
            navigate("/");
            return;
        } else {
            toast.dismiss();
            toast.error(returnLogIn.message, {
                duration: 1500,
                position: "top-center",
            });
            return;
        }
        
    }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
        <Toaster />
        <div className="flex flex-col gap-8 bg-[#060B14] p-10 rounded-xl">
            <h1 className="text-2xl">Entre na sua conta</h1>
            <input type="text" placeholder="Nome" onChange={(e) => getCredentials(e)} required/>
            <input type="password" placeholder="Senha" onChange={(e) => getCredentials(e)} required/>
            <div className="flex items-center justify-center">
                <button className="text-xl cursor-pointer bg-emerald-800 p-2.5 rounded-xl w-full hover:bg-emerald-600 text-amber-50"
                onClick={() => logFunc()}>Log In</button>
            </div>
            <p>Não tem uma conta? <Link to="/Register" className="text-blue-500">Registre-se</Link></p>
        </div>          
    </div>
  );
}

export default LogInPage;