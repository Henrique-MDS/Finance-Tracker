import type { UserProfile } from "@/types/generalTypes";
import { useAuth } from "@/Utils/AuthContext";
import { getData } from "@/Utils/getData";
import { notify } from "@/Utils/notify";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export function PerfilCard() {

  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile>();

  useEffect(() => {
    if (!user) return;

    const getProfileData = async () => {
      const response = await getData("profiles", {id: user.id}, "Buscar informações do usuário");
      
      if(response.success) {
        if(response.data && response.data.length > 0){
          setProfile(response.data[0]);
        }
      } else {
        notify.error("Erro ao buscar dados do usuário");
        return;
      }
    }

    getProfileData();
  }, [user])

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/Login" replace />;
  }
  
  return (
    <div className="bg-dark-padrao p-5 rounded-2xl">
      <div>
        {profile ? (
          <div className="flex items-center gap-3">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <User className="w-10 h-10 rounded-full bg-gray-700 p-2" />
            )}
            <p>{profile.name}</p>
          </div>
          
        ) : 
        (
          <div className="flex items-center gap-3">
            <User />
            <p>Carregando...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PerfilCard;