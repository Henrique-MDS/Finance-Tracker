import { useState } from "react";
import toast from "react-hot-toast";
import { insertUser } from "../../Utils/insertUser";
import { Toaster } from "react-hot-toast";
import { verifyEmail } from "../../Utils/verifyEmail";
import { useNavigate } from "react-router-dom";
import { notify } from "@/Utils/notify";

export function RegisterPage() {

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    let navigate = useNavigate();

    const getCredentials = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.placeholder == "Email"){
           setEmail(e.target.value); 
        } else if(e.target.placeholder == "Nome") {
            setName(e.target.value);
        } else if(e.target.placeholder == "Senha") {
            setPassword(e.target.value);
        }
    }

    const registerUser = async () => {
        if(!name || !email || !password){
            toast.dismiss();
            toast.error("Todos os campos deve estar preenchidos", {
                duration: 1500,
                position: "top-center",
            });
            return;
        }
        
        if(!verifyEmail(email)){
            toast.dismiss();
            toast.error("Email inválido", {
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

        let result = await insertUser(name, email, password);
        let getResult = result;
        
        if(getResult.success){
            notify.success(getResult.message);
            navigate("/Login");
            return;
        } else {
            if(getResult.error.code == "email_address_invalid"){
                notify.error("Email inválido");
                return;
            } else if(getResult.error.code == "weak_password"){
                notify.error("Senha deve ter no mínimo 6 caracteres");
                return;
            } else if (getResult.error.code == "over_email_send_rate_limit") {
                notify.error("Muitas tentativas. Aguarde para tentar novamente");
                return;
            }else if (getResult.error.code == "user_already_exists") {
                notify.error("Usuário já cadastrado");
                return;
            } else {
                notify.error("Erro ao registrar conta");
                return;
            }
        }
        
    }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
        <Toaster />
        <div className="flex flex-col gap-8 bg-[#060B14] p-10 rounded-xl">
            <h1 className="text-2xl">Crie uma conta</h1>
            <input type="text" placeholder="Nome" onChange={(e) => getCredentials(e)} required/>
            <input type="text" placeholder="Email" onChange={(e) => getCredentials(e)} required/>
            <input type="password" placeholder="Senha" onChange={(e) => getCredentials(e)} required/>
            <div className="flex items-center justify-center">
                <button className="text-xl cursor-pointer bg-emerald-800 p-2.5 rounded-xl w-full hover:bg-emerald-600 text-amber-50"
                onClick={() => registerUser()}>Registrar</button>
            </div> 
        </div>          
    </div>
  );
}

export default RegisterPage;