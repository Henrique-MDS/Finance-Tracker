import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/services/supabase";
import { getMFAStatus } from "@/Utils/getMFAStatus";
import { notify } from "@/Utils/notify";
import { ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    mfaStatusCard: () => Promise<void>;
}


export function ActivateMFA({ setOpen, mfaStatusCard }: Props) {

    const [qrCode, setQrCode] = useState("");
    const [code, setCode] = useState<string>("");
    const [factorId, setFactorId] = useState("");
    const [isVerified, setIsVerified] = useState(false);

    const getMfaData = async () => {
        const { data, error } = await supabase.auth.mfa.enroll({
            factorType: "totp",
            friendlyName: "Finance Tracker",
        });

        if (error) {
            if(error.code == "mfa_factor_name_conflict"){
                notify.error("MFA já cadastrado para essa conta");
                console.error("A factor with the friendly for this user already exists");
                return;
            }
            notify.error("Erro ao habilitar MFA");
            return;
        }
        
        if (data?.totp?.qr_code) {
            setQrCode(data.totp.qr_code);
            setFactorId(data.id);
        }
    };

    const verifyMFA = async () => {
        if (!factorId) {
            notify.error("Fator MFA não encontrado");
            return;
        }

        if (code.length !== 6) {
            notify.error("Digite o código de 6 dígitos");
            return;
        }

        const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
            factorId: factorId,
        });   
        
        if(challengeError){
            notify.error("Erro ao verificar MFA");
            return;
        }

        const { error: verifyError } = await supabase.auth.mfa.verify({
            factorId: factorId,
            challengeId: challenge.id,
            code: code,
        });

        if(verifyError) {
            notify.error("Código MFA inválido");
            return;
        }

        notify.success("MFA ativado com sucesso!");
        setCode("");
        setOpen(false);
        await mfaStatusCard();
    }

    const desableMFA = async () => {
        const { data, error } = await supabase.auth.mfa.listFactors();

        if (error) {
            notify.error("Erro ao buscar MFA");
            return;
        }

        const factor = data?.totp?.find(
            (factor) => factor.status === "verified"
        );

        if (!factor) {
            notify.error("Nenhum MFA ativo encontrado");
            return;
        }

        const { error: unenrollError } = await supabase.auth.mfa.unenroll({
            factorId: factor.id,
        });

        if (unenrollError) {
            console.error(unenrollError);
            notify.error("Erro ao desativar MFA");
            return;
        }

        notify.success("MFA desativado com sucesso");
        setIsVerified(false);
        setOpen(false);
        console.log(await mfaStatusCard())
        await mfaStatusCard();
    }

    const mfaStatus = async () => {
        const response = await getMFAStatus();
        if (response.success && response.data?.[0]) {
            setIsVerified(!!response.data[0].verified);
        }
    }

    useEffect(() => {
        mfaStatus();
    }, [])


  return (
    <div className="bg-dark-padrao p-5 rounded-xl w-full flex flex-col gap-5">
        <div className="w-full flex items-center justify-center">
            {
                isVerified ?
                <Button
                    className="p-5 bg-red-padrao cursor-pointer"
                    onClick={() => desableMFA()}
                >
                    Desativar
                </Button>
                :
                <Button
                    className="p-5 bg-green-padrao cursor-pointer"
                    onClick={() => getMfaData()}
                >
                    Adicionar MFA
                </Button>
            }
            
        </div>
        <div className="w-full flex items-center justify-center">
            {qrCode ? 
                <div className="w-full">
                    <div className="flex flex-col items-center bg-white p-4 rounded-lg">
                        <img src={qrCode} 
                            alt="QR Code para configuração do MFA"
                            className="w-64 h-64"
                        />
                        <p className="text-text-padrao">Aponte a camera do seu Celular para o qrCode no aplicativo de autenticação</p>
                    </div>
                    <div>

                    </div>
                </div>
                :
                <div className="w-full h-full flex items-center justify-center">
                    <ShieldAlert size={300} 
                        style={{color: "hsla(0, 0%, 90%, 0.1)"}}
                    />
                </div>
            }
        </div>
        <div 
            className="w-full flex flex-col gap-3 items-center justify-center"
            style={qrCode ? {display: "flex"} : {display: "none"}}
        >
            <p>Digite o código que aparce no seu celular</p>
            <div>
                <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    className="h-20 w-full p-4 text-center text-3xl font-semibold"
                    style={{ border: "1px solid #1e2939" }}
                    value={code}
                    onChange={(e) => {
                        if (e.target.value.length <= 6) {
                            setCode(e.target.value);
                        }
                    }}
                />                
            </div>
            <Button
                className="p-5 bg-green-padrao cursor-pointer"
                onClick={() => verifyMFA()}
            >
                Cadastrar
            </Button>                        
        </div>
    </div>
  );
}

export default ActivateMFA;