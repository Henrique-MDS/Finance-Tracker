import { FieldLabel } from "@/components/ui/field";
import { SettingsHeader } from "../SettingsComponents/SettingsHeader";
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react";
import { supabase } from "@/services/supabase";
import { useAuth } from "@/Utils/AuthContext";
import { Navigate } from "react-router-dom";
import { notify } from "@/Utils/notify";
import { getData } from "@/Utils/getData";

export function ParamsCard() {

    const [idgerAutomatico, setIdGeraAutomatico] = useState(false);
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!user) {
        return <Navigate to="/Login" replace />;
    }

    const loadParameters = async () => {
        const response = await getData("Params", {user_id: user.id}, "Buscar parâmetros");

        if(!response.success){
            notify.error("Erro ao carregar parâmetros");
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
            notify.error("Erro ao atualizar parâmetro");
            return;
        }
    }

    useEffect(() => {
        loadParameters();
    }, []);


  return (
    <div className="bg-dark-padrao p-5 rounded-xl w-[450px] flex flex-col gap-5">
      <SettingsHeader theme="bg-blue-padrao" title="Configurações"/>
      <div>
        <div className="flex items-center gap-x-3.5">
            <Switch 
                className="cursor-pointer" 
                id="IDGERTRANAUT"
                checked={idgerAutomatico}
                onCheckedChange={(checked) => saveIdgerAutomatico(checked)}
            />
            <FieldLabel htmlFor="IDGERTRANAUT">
                Gera transação automática ao fazer aporte de metas
            </FieldLabel>
        </div>
      </div>
    </div>
  );
}

export default ParamsCard;