import { CalendarIcon, FileText, Save } from "lucide-react";
import { Calendar } from "@/components/ui/calendar"
import NewGoalInput from "../Inputs/newGoalInput";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "../ui/button";
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"


export function NewGoalModal() {

    const [title, setTitle] = useState("");
    const [goalValue, setGoalValue] = useState("");
    const [date, setDate] = React.useState<Date>();
    
    return (
        <div className="h-full flex flex-col gap-5 justify-between">
            <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2">
                    <FileText color="#2CAE60"/>
                    <h2 className="text-[16px]">Informações da Meta</h2>
                </div>
                <div className="flex flex-col gap-4">
                    <NewGoalInput 
                        title="Nome da Meta *" 
                        placeholder="Ex: Viagem para o Havaii" 
                        desc="Dê um nome inspirador a sua meta"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}                        
                    />
                    <NewGoalInput 
                        title="Valor da Meta" 
                        placeholder="R$ 0,00" 
                        desc="Qual valor total deseja alcançar?"
                        type="number"
                        value={goalValue}
                        onChange={(e) => setGoalValue(e.target.value)}                        
                    />
                    <div className="flex flex-col gap-2">
                        <p>Data da transação</p>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    data-empty={!date}
                                    className="w-full justify-start text-left p-5 font-normal data-[empty=true]:text-muted-foreground bg-dark-padrao"
                                >
                                <CalendarIcon />
                                {date ? format(date, "PPP") : <span>Selecione uma data</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={date} onSelect={setDate}/>
                            </PopoverContent>
                        </Popover>
                    </div>         
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <Separator className="bg-gray-800"/>
                <Button className="bg-green-padrao hover:bg-green-padrao-25 p-5 flex items-center gap-4 cursor-pointer">
                    <Save />
                    Salvar
                </Button>
            </div>
        </div>
    );
}

export default NewGoalModal;