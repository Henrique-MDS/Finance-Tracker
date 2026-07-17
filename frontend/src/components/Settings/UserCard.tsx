import { User } from "lucide-react";
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

type UserData = {
    created_at: string;
    email: string;
    id: string;
    name: string;
    password: string;
    updated_at: string;
}

export function UserCard({ userData }:{userData:UserData | undefined}) {
    const [open, setOpen] = React.useState(false);

  return (
    <div className="bg-[#0B1723] p-5 rounded-xl w-[400px] flex flex-col gap-5">
        <div className="flex items-center gap-3">
            <div className="bg-[#5442A2] w-fit p-1 rounded-full">
                <User color="#ffffff"/>
            </div>
            <p className="text-white">Conta</p>
        </div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-[#5442A2] w-fit p-2 rounded-full">
                    <User color="#ffffff"/>
                </div>                    
                <div>
                    <p className="text-white">{userData?.name}</p>
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
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                <CommandItem>Calendar</CommandItem>
                                <CommandItem>Search Emoji</CommandItem>
                                <CommandItem>Calculator</CommandItem>
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