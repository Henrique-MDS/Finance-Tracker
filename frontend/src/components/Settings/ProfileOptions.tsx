import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { notify } from "@/Utils/notify";
import { uploadAvatar } from "@/Utils/uploadAvatar";
import { useAuth } from "@/Utils/AuthContext";
import { Navigate } from "react-router-dom";

export function ProfileOptions() {

    const { user, loading } = useAuth();

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!user) {
        return <Navigate to="/Login" replace />;
    }

    const userId = user.id;
    const [profilePic, setProfilePic] = useState<File | null>();
    const [preview, setPreview] = useState<string | null>();

    const salvarFotoDePerfil = async () => {
        const path = `${userId}/${crypto.randomUUID()}.png`;
        
        if (!profilePic || !path || !userId) return;

        const response = await uploadAvatar(profilePic!, path, userId);
        
        if(!response.success){     
            if(response.error == "StorageApiError: The resource already exists"){
                return;
            }
            notify.error(response.message);
        }
        notify.success("Informações atualizadas");
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
    
  return (
    <div>
        <h1 className="text-xl">Informações do Perfil</h1>
        <div className="flex flex-col gap-3">
            <h2>Alterar foto de perfil</h2>
            <div className="flex flex-col gap-3">
                <Input placeholder="Faça o upload" type="file" 
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if(!file) return;
                            setProfilePic(file);
                            setPreview(URL.createObjectURL(file));
                        }}
                />
            </div>
            <div className="flex flex-col gap-5">
                <p>Previa...</p>
                {preview && (
                    <div>
                        <img src={preview} alt="imagem de perfil" className="w-32 h-32 rounded-full object-cover"/>                                     
                    </div>
                )}
            </div>
            <Button className="cursor-pointer bg-[#2CAE60] hover:bg-[#207241]"
                    onClick={() => salvarFotoDePerfil()}>
                Salvar
            </Button>
        </div>
    </div>
  );
}

export default ProfileOptions;