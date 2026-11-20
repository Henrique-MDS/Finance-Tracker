import { FieldLabel } from "@/components/ui/field";
import { SettingsHeader } from "../SettingsComponents/SettingsHeader";
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react";
import { supabase } from "@/services/supabase";
import { useAuth } from "@/Utils/AuthContext";
import { Navigate } from "react-router-dom";
import { notify } from "@/Utils/notify";
import { getData } from "@/Utils/getData";
import { Languages, Settings } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { LANGUAGES, isLanguage } from "@/i18n/i18n";
import SelectInput from "@/components/Inputs/Select_Input";

export function ParamsCard() {

    const [idgerAutomatico, setIdGeraAutomatico] = useState(false);
    const { user, loading } = useAuth();
    const { t, language, setLanguage } = useLanguage();

    if (loading) {
        return <div>{t("common.loading")}</div>;
    }

    if (!user) {
        return <Navigate to="/Login" replace />;
    }

    const loadParameters = async () => {
        const response = await getData("Params", {user_id: user.id}, "Buscar parâmetros");

        if(!response.success){
            notify.error(t("settings.paramsLoadError"));
            return;
        }

        if(response.data && response.data.length > 0){
            setIdGeraAutomatico(response.data[0].IDGERTRANAUT);
        }
    }

    const saveIdgerAutomatico = async (checked: boolean) => {
        setIdGeraAutomatico(checked);
        const { error } = await supabase.from("Params").update({IDGERTRANAUT: checked}).eq("user_id", user.id);

        if(error) {
            notify.error(t("settings.paramsUpdateError"));
            return;
        }
    }

    useEffect(() => {
        loadParameters();
    }, []);


  return (
    <div className="bg-dark-padrao p-5 rounded-xl min-w-[250px] lg:w-[450px] flex flex-col gap-5">
      <SettingsHeader theme="bg-blue-padrao" title={t("settings.title")} icon={Settings}/>
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-x-3.5">
            <Switch
                className="cursor-pointer"
                id="IDGERTRANAUT"
                checked={idgerAutomatico}
                onCheckedChange={(checked) => saveIdgerAutomatico(checked)}
            />
            <FieldLabel htmlFor="IDGERTRANAUT">
                {t("settings.autoTransaction")}
            </FieldLabel>
        </div>
        <div className="flex items-start gap-x-3.5">
            <Languages className="mt-1 shrink-0"/>
            <div className="w-full">
                <SelectInput
                    label={t("settings.language")}
                    placeholder={t("settings.language")}
                    options={LANGUAGES}
                    value={language}
                    onValueChange={(value) => isLanguage(value) && setLanguage(value)}
                />
            </div>
        </div>
      </div>
    </div>
  );
}

export default ParamsCard;
