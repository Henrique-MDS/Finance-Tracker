import { User as UserIcon } from "lucide-react";
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandList,
} from "@/components/ui/command"
import AccountOptions from "./AccountOptions";
import ProfileOptions from "./ProfileOptions";
import type { User } from "@supabase/supabase-js";

type Props = {
    userData: User;
};

export function UserCard({ userData }:Props) {
    const [open, setOpen] = React.useState(false);

  return (
    <div className="bg-[#0B1723] p-5 rounded-xl w-[400px] flex flex-col gap-5">
        <div className="flex items-center gap-3">
            <div className="bg-[#5442A2] w-fit p-1 rounded-full">
                <UserIcon color="#ffffff"/>
            </div>
            <p className="text-white">Conta</p>
        </div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-[#5442A2] w-fit p-2 rounded-full">
                    <UserIcon color="#ffffff"/>
                </div>                    
                <div>
                    <p className="text-white">nome</p>
                    <p style={{fontSize: "13px"}}>{userData?.email}</p>
                </div>
            </div>                
            <div>
                <Button onClick={() => setOpen(true)} variant="outline" className="w-fit cursor-pointer">
                    Editar Perfil
                </Button>
                <CommandDialog open={open} onOpenChange={setOpen}>
                    <Command>
                        <CommandList>
                            <CommandGroup className="p-5">
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <AccountOptions />
                                    </div>
                                    <div>
                                        <ProfileOptions />
                                    </div>
                                </div>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </CommandDialog>
            </div>
        </div>
    </div>
  );
}

export default UserCard;