import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { supabase } from "@/services/supabase";
import { notify } from "@/Utils/notify";
import { verifyPassword } from "@/components/ui/verifyPassword";
import { Save } from "lucide-react";

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
            <h2 className="text-text-padrao py-3">Alterar Senha</h2>
            <div className="flex flex-col gap-3">
                <Input 
                    placeholder="Senha nova" name="newPass" 
                    onChange={(e) => setNewPassword(e.target.value)}
                    type="password"
                    value={newPassword}
                    className="p-5"
                    style={{border: "1px solid #1e2939"}}
                />
            </div>
            <div className="w-full flex justify-end">
                <Button 
                    className="cursor-pointer bg-green-padrao hover:bg-[#207241] w-fit"
                    onClick={() => saveFormData()}
                >
                    <Save />
                    Salvar
                </Button>
            </div>
        </div>
    </div>
  );
}

export default AccountOptions;