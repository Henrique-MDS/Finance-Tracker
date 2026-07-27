import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react";

export function AccountOptions() {

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, seNewPassword] = useState("");

    const saveFormData = () => {
        
    }
   
  return (
    <div>
        <h1 className="text-xl">Informações da Conta</h1>
        <div className="flex flex-col gap-3">
            <h2>Alterar Senha</h2>
            <div className="flex flex-col gap-3">
                <Input placeholder="Senha antiga" name="oldPass" 
                       onChange={(e) => setOldPassword(e.target.value)}
                       value={oldPassword}/>
                <Input placeholder="Senha nova" name="newPass" 
                       onChange={(e) => seNewPassword(e.target.value)}
                       value={newPassword}/>
            </div>
            <Button className="cursor-pointer bg-[#2CAE60] hover:bg-[#207241]">
                Salvar
            </Button>
        </div>
    </div>
  );
}

export default AccountOptions;