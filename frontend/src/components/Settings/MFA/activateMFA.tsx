import { useLanguage } from "@/i18n/LanguageContext";
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
    const { t } = useLanguage();

    const getMfaData = async () => {
        const { data, error } = await supabase.auth.mfa.enroll({
            factorType: "totp",
            friendlyName: "Finance Tracker",
        });

        if (error) {
            if(error.code == "mfa_factor_name_conflict"){
                notify.error(t("mfa.alreadyRegistered"));
                console.error("A factor with the friendly for this user already exists");
                return;
            }
            notify.error(t("mfa.enableError"));
            return;
        }
        
        if (data?.totp?.qr_code) {
            setQrCode(data.totp.qr_code);
            setFactorId(data.id);
        }
    };

    const verifyMFA = async () => {
        if (!factorId) {
            notify.error(t("mfa.factorNotFound"));
            return;
        }

        if (code.length !== 6) {
            notify.error(t("mfa.enterSixDigits"));
            return;
        }

        const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
            factorId: factorId,
        });   
        
        if(challengeError){
            notify.error(t("mfa.verifyError"));
            return;
        }

        const { error: verifyError } = await supabase.auth.mfa.verify({
            factorId: factorId,
            challengeId: challenge.id,
            code: code,
        });

        if(verifyError) {
            notify.error(t("mfa.invalidCode"));
            return;
        }

        notify.success(t("mfa.activated"));
        setCode("");
        setOpen(false);
        await mfaStatusCard();
    }

    const desableMFA = async () => {
        const { data, error } = await supabase.auth.mfa.listFactors();

        if (error) {
            notify.error(t("mfa.fetchError"));
            return;
        }

        const factor = data?.totp?.find(
            (factor) => factor.status === "verified"
        );

        if (!factor) {
            notify.error(t("mfa.noActive"));
            return;
        }

        const { error: unenrollError } = await supabase.auth.mfa.unenroll({
            factorId: factor.id,
        });

        if (unenrollError) {
            console.error(unenrollError);
            notify.error(t("mfa.disableError"));
            return;
        }

        notify.success(t("mfa.deactivated"));
        setIsVerified(false);
        setOpen(false);
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
                    {t("mfa.disableButton")}
                </Button>
                :
                <Button
                    className="p-5 bg-green-padrao cursor-pointer"
                    onClick={() => getMfaData()}
                >
                    {t("mfa.addButton")}
                </Button>
            }
            
        </div>
        <div className="w-full flex items-center justify-center">
            {qrCode ? 
                <div className="w-full">
                    <div className="flex flex-col items-center bg-white p-4 rounded-lg">
                        <img src={qrCode} 
                            alt={t("mfa.qrAlt")}
                            className="w-64 h-64"
                        />
                        <p className="text-text-padrao">{t("mfa.scanQr")}</p>
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
            <p>{t("mfa.typeCode")}</p>
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
                {t("mfa.registerButton")}
            </Button>                        
        </div>
    </div>
  );
}

export default ActivateMFA;