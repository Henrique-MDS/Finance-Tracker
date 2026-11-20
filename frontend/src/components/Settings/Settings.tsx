import { useLanguage } from "@/i18n/LanguageContext";
import { Navigate } from "react-router-dom"
import { useAuth } from "@/Utils/AuthContext";
import UserCard from "./UserCard/UserCard";
import ParamsCard from "./ParamsCard/ParamsCard";
import MFACard from "./MFA/MFACard";

export function SettingsPage() {

  const { user, loading } = useAuth();
  const { t } = useLanguage();
  
  if (loading) {
    return <div>{t("common.loading")}</div>;
  }

  if (!user) {
    return <Navigate to="/Login" replace />;
  }

  return (
    <div className="flex flex-col gap-5">
      <UserCard userData={user}/>
      <ParamsCard />
      <MFACard />
    </div>
  );
}

export default SettingsPage;