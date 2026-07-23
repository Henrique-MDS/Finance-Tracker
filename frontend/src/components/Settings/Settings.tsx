import { Navigate } from "react-router-dom"
import UserCard from "./UserCard";
import { useAuth } from "@/Utils/AuthContext";

export function SettingsPage() {

    const { user, loading } = useAuth();
    if (loading) {
    return <div>Carregando...</div>;
    }
    if (!user) {
    return <Navigate to="/Login" replace />;
    }

  return (
    <div>
        <UserCard userData={user}/>
    </div>
  );
}

export default SettingsPage;