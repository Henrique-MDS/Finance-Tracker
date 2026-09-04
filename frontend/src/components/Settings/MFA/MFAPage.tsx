import { Shield } from "lucide-react";
import logo from "@/assets/logo-tracker.png";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { notify } from "@/Utils/notify";
import { supabase } from "@/services/supabase";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function MFAPage() {

    const [code, setCode] = useState("");
    let navigate = useNavigate();

    const verifyMFA = async () => {
        if(!code || code.length != 6) {
            notify.error("Digite o código corretamente");
            return;
        }

        const { data, error } = await supabase.auth.mfa.listFactors();

        if(error) {
            notify.error("Erro ao buscar MFA");
            return;
        }

        const factor = data.totp?.find(
            (factor) => factor.status === "verified"
        );

        if (!factor) {
            notify.error("Nenhum MFA ativo encontrado");
            return;
        }

        const { data: challenge, error: challengError } = await supabase.auth.mfa.challenge({
            factorId: factor.id
        });

        if(challengError) {
            notify.error("Erro ao buscar id do MFA");
            return;
        }

        const { error: errorVerify } = await supabase.auth.mfa.verify({
            factorId: factor.id,
            challengeId: challenge.id,
            code: code
        });

        if(errorVerify){
            notify.error("Erro ao verificar código mfa");
            return;
        }

        notify.success("Autenticação concluída");
        navigate("/");
    }

  return (
    <div className="w-full min-h-dvh flex flex-col items-center justify-center">
        <Toaster />
        <div>
            <img src={logo} alt="finance-tracker-logo" className="w-96 h-64"/>
        </div>
        <div className="bg-dark-padrao p-8 rounded-md shadow-sm flex flex-col items-center gap-5">
            <div className="w-full flex items-center justify-center gap-3">
                <Shield size={30} color="#5AC388"/>
                <h1 className="text-foreground text-2xl">Autenticação multi fatores</h1>
            </div>
            <div className="flex flex-col items-center">
                <p>Autenticação de dois fatores requerida</p>
                <p>Digite o código de 6 dígitos de seu app de segurança para continuar o login</p>
            </div>            
            <div>
                <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    className="h-20 w-full p-4 text-center text-3xl font-semibold"
                    style={{ border: "1px solid var(--border)" }}
                    value={code}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 6) {
                            setCode(value);
                        }
                    }}
                />
            </div>
            <div>
                <Button
                    className="bg-green-padrao cursor-pointer p-5"
                    onClick={() => verifyMFA()}
                >
                    Entrar
                </Button>
            </div>
        </div>
    </div>
  );
}

export default MFAPage;