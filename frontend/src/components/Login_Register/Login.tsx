import { useState } from "react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { getUserLogin } from "../../Utils/getUserLogin";
import { Link, useNavigate } from "react-router-dom";
import { notify } from "@/Utils/notify";

export function LogInPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    let navigate = useNavigate();

    const getCredentials = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.placeholder == "Email") {
            setEmail(e.target.value);
        } else if(e.target.placeholder == "Senha") {
            setPassword(e.target.value);
        }
    }

    const logFunc = async () => {
        if(!email  || !password){
            notify.error("Todos os campos deve estar preenchidos");
            return;
        }
        

        if(email.length < 5){
            notify.error("Nome deve conter no mínimo 5 digitos");
            return;
        }

        if(password.length < 5){
            notify.error("Senha deve conter no mínimo 5 digitos");
            return;
        }
        
        const returnLogIn = await getUserLogin(email, password);
        
        if(returnLogIn.success){
            if(returnLogIn.hasMFA == true){
                return navigate("/mfa");
            }
            notify.success(returnLogIn.message);
            navigate("/");
            return;
        } else if(returnLogIn.error.code == "email_not_confirmed") {
            toast.dismiss();
            toast.error("Uma verificação foi enviada para seu email, verifique para prosseguir", {
                duration: 3500,
                position: "top-center",
            });
            return;
        } else {
            notify.error(returnLogIn.message);
            returnLogIn;
        }
        
    }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
        <Toaster />
        <div className="flex flex-col gap-8 bg-dark-padrao p-10 rounded-xl">
            <h1 className="text-2xl">Entre na sua conta</h1>
            <input 
                type="text" 
                placeholder="Email" 
                onChange={(e) => getCredentials(e)} 
                required
                className="p-3 rounded-sm"
                style={{border: "1px solid #1e2939"}}
            />
            <input 
                type="password" 
                placeholder="Senha" 
                onChange={(e) => getCredentials(e)} 
                required
                className="p-3 rounded-sm"
                style={{border: "1px solid #1e2939"}}
            />
            <div className="flex items-center justify-center">
                <button className="text-xl cursor-pointer bg-green-padrao p-2.5 rounded-xl w-full hover:bg-green-padrao-25 text-white"
                onClick={() => logFunc()}>Log In</button>
            </div>
            <p>Não tem uma conta? <Link to="/Register" className="text-blue-padrao">Registre-se</Link></p>
        </div>          
    </div>
  );
}

export default LogInPage;