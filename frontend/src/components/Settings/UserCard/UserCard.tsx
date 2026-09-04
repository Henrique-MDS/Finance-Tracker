import { User as UserIcon, UserRound } from "lucide-react";
import * as React from "react"
import { Button } from "@/components/ui/button"
import type { User } from "@supabase/supabase-js";
import { getData } from "@/Utils/getData";
import type { UserProfile } from "@/types/generalTypes";
import { notify } from "@/Utils/notify";
import { useAuth } from "@/Utils/AuthContext";
import AccountOptions from "./AccountOptions";
import ProfileOptions from "./ProfileOptions";
import { SettingsHeader } from "../SettingsComponents/SettingsHeader";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator"
import { Navigate } from "react-router-dom";


type Props = {
    userData: User;
};

export function UserCard({ userData }:Props) {
    const [open, setOpen] = React.useState(false);
    const [profile, setProfile] = React.useState<UserProfile>();
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/Login" replace />;
    }

    React.useEffect(() => {
        const getUseerProfileData = async () => {
            const response = await getData("profiles", {id: userData.id}, "Buscar informações do perfil");

            if(response.success){
                if(response.data && response.data[0]){
                    setProfile(response.data[0]);
                }
            } else {
                notify.error("Erro ao buscar informações do perfil");
                return;
            }
        }

        getUseerProfileData();
    }, [user.id])
    
  return (
    <div className="bg-dark-padrao p-5 rounded-xl min-w-[250px] lg:w-[450px] flex flex-col gap-5">
        <SettingsHeader theme="bg-purple-padrao" title="Conta" icon={UserIcon}/>
        <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="flex flex-col lg:flex-row items-center gap-3">
                {profile && profile.avatar_url ? 
                    (
                        <div>
                            <img src={profile.avatar_url} alt="" className="rounded-full w-[50px] h-[50px] lg:h-[40px]"/>
                        </div>                            
                    ) 
                    :
                    (
                        <div className="bg-purple-padrao w-fit p-2 rounded-full">
                            <UserIcon color="#ffffff"/>
                        </div>                            
                    )
                }                  
                <div className="w-full flex flex-col items-center lg:items-baseline">
                    <p className="text-foreground">{profile?.name}</p>
                    <p style={{fontSize: "13px"}}>{userData?.email}</p>
                </div>
            </div>                
            <div>
                <Button onClick={() => setOpen(true)} variant="outline" className="w-fit cursor-pointer">
                    Editar Perfil
                </Button>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="!max-w-4xl !h-[80vh] bg-dark-padrao text-foreground">
                        <DialogHeader>
                        <div className="flex items-center gap-3">
                            <UserRound size={60} color="#2CAE60" className="bg-green-padrao-25 p-2 rounded-full"/>
                            <DialogTitle className="text-xl">
                                Conta
                            </DialogTitle>
                        </div>
                        </DialogHeader>
                        <p className="text-text-padrao">Altere informações do seu perfil</p>
                        <Separator/>
                        <div className="flex flex-col gap-4 text-foreground">
                            <div>
                                <AccountOptions />
                            </div>
                            <div>
                                <ProfileOptions />
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    </div>
  );
}

export default UserCard;