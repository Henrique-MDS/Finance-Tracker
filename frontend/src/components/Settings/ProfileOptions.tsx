import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function ProfileOptions() {
  return (
    <div>
        <h1 className="text-xl">Informações do Perfil</h1>
        <div className="flex flex-col gap-3">
            <h2>Alterar Senha</h2>
            <div className="flex flex-col gap-3">
                <Input placeholder="Senha antiga" />
                <Input placeholder="Senha nova" />
            </div>
            <Button className="cursor-pointer bg-[#2CAE60] hover:bg-[#207241]">
                Salvar
            </Button>
        </div>
    </div>
  );
}

export default ProfileOptions;