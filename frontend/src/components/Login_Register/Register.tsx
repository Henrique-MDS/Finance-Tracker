import { useLanguage } from "@/i18n/LanguageContext";
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
    const { t } = useLanguage();

    const registerUser = async () => {
        if(!name || !email || !password){
            toast.dismiss();
            toast.error(t("common.allFieldsRequired"), {
                duration: 1500,
                position: "top-center",
            });
            return;
        }
        
        if(!verifyEmail(email)){
            toast.dismiss();
            toast.error(t("common.invalidEmail"), {
                duration: 1500,
                position: "top-center",
            });
            return;
        }

        if(name.length < 5){
            toast.dismiss();
            toast.error(t("common.nameMinLength"), {
                duration: 1500,
                position: "top-center",
            });
            return;
        }

        if(password.length < 5){
            toast.dismiss();
            toast.error(t("common.passwordMinLength"), {
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
                notify.error(t("common.invalidEmail"));
                return;
            } else if(getResult.error.code == "weak_password"){
                notify.error(t("auth.weakPassword"));
                return;
            } else if (getResult.error.code == "over_email_send_rate_limit") {
                notify.error(t("auth.rateLimit"));
                return;
            }else if (getResult.error.code == "user_already_exists") {
                notify.error(t("auth.userExists"));
                return;
            } else {
                notify.error(t("auth.registerError"));
                return;
            }
        }
        
    }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
        <Toaster />
        <div className="flex flex-col gap-8 bg-dark-padrao p-10 rounded-xl">
            <h1 className="text-2xl">{t("auth.registerTitle")}</h1>
            <input 
                type="text" 
                placeholder={t("common.name")} 
                onChange={(e) => setName(e.target.value)} 
                required
                className="p-3 rounded-sm"
                style={{border: "1px solid #1e2939"}}
            />
            <input 
                type="text" 
                placeholder="Email" 
                onChange={(e) => setEmail(e.target.value)} 
                required
                className="p-3 rounded-sm"
                style={{border: "1px solid #1e2939"}}
            />
            <input 
                type="password" 
                placeholder={t("common.password")} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                className="p-3 rounded-sm"
                style={{border: "1px solid #1e2939"}}
            />
            <div className="flex items-center justify-center">
                <button className="text-xl cursor-pointer bg-emerald-800 p-2.5 rounded-xl w-full hover:bg-emerald-600 text-amber-50"
                onClick={() => registerUser()}>{t("auth.register")}</button>
            </div> 
        </div>          
    </div>
  );
}

export default RegisterPage;