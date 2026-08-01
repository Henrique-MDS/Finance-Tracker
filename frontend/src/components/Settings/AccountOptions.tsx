import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { supabase } from "@/services/supabase";
import { notify } from "@/Utils/notify";
import { verifyPassword } from "../ui/verifyPassword";

export function AccountOptions() {

    const [newPassword, setNewPassword] = useState("");

    const saveFormData = async () => {
        if(verifyPassword(newPassword)){
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });
            
            if(error){
                notify.error("Erro ao atualizar senha");
                return;
            }

            notify.success("Senha atualizada");
            setNewPassword("");
        }
    }

  return (
    <div>
        <h1 className="text-xl">Informações da Conta</h1>
        <div className="flex flex-col gap-3">
            <h2>Alterar Senha</h2>
            <div className="flex flex-col gap-3">
                <Input placeholder="Senha nova" name="newPass" 
                       onChange={(e) => setNewPassword(e.target.value)}
                       type="password"
                       value={newPassword}/>
            </div>
            <Button className="cursor-pointer bg-green-padrao hover:bg-[#207241]"
                    onClick={() => saveFormData()}>
                Salvar
            </Button>
        </div>
    </div>
  );
}

export default AccountOptions;