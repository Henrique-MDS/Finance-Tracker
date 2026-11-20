import { useLanguage } from "@/i18n/LanguageContext";
import { Link } from "react-router-dom";


export function NotFoundPage() {
  const { t } = useLanguage();

  
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
            <h1 className="text-5xl">404</h1>
            <p>{t("notFound.title")}</p>
            <p>{t("notFound.desc")}</p>
            <Link to={"/"} className="text-[#2CAE60]">{t("notFound.back")}</Link>
        </div>
    </div>
  );
}

export default NotFoundPage;