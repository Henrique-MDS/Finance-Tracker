import { useLanguage } from "@/i18n/LanguageContext";
import { ShieldPlus, Smartphone } from "lucide-react";
import { SettingsHeader } from "../SettingsComponents/SettingsHeader";
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import ActivateMFA from "./activateMFA";
import { getMFAStatus } from "@/Utils/getMFAStatus";


export function MFACard() {

    const [open, setOpen] = useState(false);
    const { t } = useLanguage();
    const [isVerified, setIsVerified] = useState(false);

    const mfaStatusCard = async () => {
        const response = await getMFAStatus();
        if (response.success && response.data?.[0]) {
            setIsVerified(!!response.data[0].verified);
        }
    }

    useEffect(() => {
        mfaStatusCard();
    }, [])

  return (
    <div className="bg-dark-padrao p-5 rounded-xl min-w-[250px] lg:w-[450px] flex flex-col gap-5">
        <SettingsHeader theme="bg-green-padrao" title={t("mfa.cardTitle")} icon={ShieldPlus}/>
        <div>
            <p>{t("mfa.cardDesc")}</p>
        </div>
        <Separator />
        <div className="flex flex-col lg:flex-row items-center gap-3">
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-1">
                    <ShieldPlus />
                    <p className="text-foreground font-semibold">
                        {t("mfa.statusLabel")} <span className="font-semibold text-red-padrao" style={isVerified ? {color: "green"} : {color: "red"}}>{isVerified ? t("mfa.enabled") : t("mfa.disabled")}</span>
                    </p>
                </div>
                <div>
                    <p>{t("mfa.enableDesc")}</p>
                </div>
            </div>
            <Button 
                className="w-fit cursor-pointer bg-transparent hover:bg-green-padrao hover:text-white text-green-padrao"
                style={{border: "1px solid green"}}
                onClick={() => setOpen(true)}
            >
                {t("mfa.enableButton")}
            </Button>
        </div>
        <Separator />
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1">
                <Smartphone />
                <p className="text-foreground">{t("mfa.howItWorks")}</p>
            </div>
            <div>
                <p>{t("mfa.howItWorksDesc")}</p>
            </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="!max-w-4xl !h-[80vh] bg-dark-padrao text-foreground">
                <DialogHeader>
                <div className="flex items-center gap-3">
                    <ShieldPlus size={60} color="#2CAE60" className="bg-green-padrao-25 p-2 rounded-full"/>
                    <DialogTitle className="text-xl">
                        {t("mfa.dialogTitle")}
                    </DialogTitle>
                </div>
                </DialogHeader>
                <Separator/>
                <div className="flex flex-col gap-4 text-foreground">
                    <div>
                        <ActivateMFA setOpen={setOpen} mfaStatusCard={mfaStatusCard}/>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  );
}

export default MFACard;