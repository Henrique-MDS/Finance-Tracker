import { useLanguage } from "@/i18n/LanguageContext";
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
    const { t } = useLanguage();

    const logFunc = async () => {
        if(!email  || !password){
            notify.error(t("common.allFieldsRequired"));
            return;
        }
        

        if(email.length < 5){
            notify.error(t("common.nameMinLength"));
            return;
        }

        if(password.length < 5){
            notify.error(t("common.passwordMinLength"));
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
            toast.error(t("auth.emailVerification"), {
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
            <h1 className="text-2xl">{t("auth.loginTitle")}</h1>
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
                <button className="text-xl cursor-pointer bg-green-padrao p-2.5 rounded-xl w-full hover:bg-green-padrao-25 text-white"
                onClick={() => logFunc()}>{t("auth.login")}</button>
            </div>
            <p>{t("auth.noAccount")} <Link to="/Register" className="text-blue-padrao">{t("auth.signUp")}</Link></p>
        </div>          
    </div>
  );
}

export default LogInPage;