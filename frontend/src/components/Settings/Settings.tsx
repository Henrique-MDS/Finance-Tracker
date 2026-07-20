import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { getData } from "@/Utils/getData";
import { notify } from "@/Utils/notify";
import UserCard from "./UserCard";
import type { UserData } from "@/types/user";

export function SettingsPage() {

    const userId = localStorage.getItem("userId");
    if (!userId) {
        return <Navigate to="/login" replace />;
    }  
    const [userData, setUserData] = useState<UserData>();

    useEffect(() => {
        const getUserData = async () => {
            const response = await getData("Users", { id: userId }, "Buscar dados do usuário");
            
            if(response.success){
                if(response.data?.length == 1){
                    setUserData(response.data[0]);
                }
            } else {
                notify.error("Erro ao buscar informações do usuário")
            }
        }

        getUserData();
    },[])
  return (
    <div>
        {userData && <UserCard userData={userData}/>}
    </div>
  );
}

export default SettingsPage;