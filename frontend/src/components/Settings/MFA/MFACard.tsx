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
    <div className="bg-dark-padrao p-5 rounded-xl w-[450px] flex flex-col gap-5">
        <SettingsHeader theme="bg-green-padrao" title="Autenticação de dois fatores (MFA)" icon={ShieldPlus}/>
        <div>
            <p>Aumente a segurança da sua conta habilitando a Autenticação em duas etapas</p>
        </div>
        <Separator />
        <div className="flex items-center gap-3">
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-1">
                    <ShieldPlus />
                    <p className="text-white font-semibold">
                        Status: <span className="font-semibold text-red-padrao" style={isVerified ? {color: "green"} : {color: "red"}}>{isVerified ? "Ativado" : "Desativado"}</span>
                    </p>
                </div>
                <div>
                    <p>Ao habilitar o MFA, você precisará de um código adicional além da sua senha para acessar sua conta</p>
                </div>
            </div>
            <Button 
                className="w-fit cursor-pointer bg-transparent hover:bg-green-padrao hover:text-white text-green-padrao"
                style={{border: "1px solid green"}}
                onClick={() => setOpen(true)}
            >
                Ativar MFA
            </Button>
        </div>
        <Separator />
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1">
                <Smartphone />
                <p className="text-white">Como funciona?</p>
            </div>
            <div>
                <p>Você receberá códigos de verificação em um aplicativo autenticador como Google Authenticator, Authy, etc, sempre que fizer um login</p>
            </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="!max-w-4xl !h-[80vh] bg-dark-padrao text-white">
                <DialogHeader>
                <div className="flex items-center gap-3">
                    <ShieldPlus size={60} color="#2CAE60" className="bg-green-padrao-25 p-2 rounded-full"/>
                    <DialogTitle className="text-xl">
                        Autenticação de duas Etapas
                    </DialogTitle>
                </div>
                </DialogHeader>
                <Separator className="bg-gray-800"/>
                <div className="flex flex-col gap-4 text-white">
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