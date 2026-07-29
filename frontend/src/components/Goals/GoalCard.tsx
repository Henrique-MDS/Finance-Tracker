import { Calendar, Laptop } from "lucide-react";
import { Progress } from "@/components/ui/progress"
import { useState } from "react";


export function GoalCard() {

    const [progress, setProgress] = useState(50);

  return (
    <div className="flex gap-3 w-full bg-[#0B1723] p-5 rounded-xl">
        <div>
            <Laptop size={50}/>
        </div>
        <div className="w-full flex flex-col gap-3">
            <div className="flex flex-col gap-3 w-full">                                
                <p className="text-xl text-white">Comprar Notebook</p>                                
                <div className="flex items-center gap-1">
                    <Calendar size={18}/>
                    <p>Meta até 20/12/2026</p>
                </div>
            </div>
            <div className="w-full flex flex-col gap-3">
                <Progress value={progress} className="w-[100%]" />
                <div className="flex justify-between w-full">
                    <span>
                        <p>RS 3.400,00</p>
                        <p>de 5.000,00</p>
                    </span>
                    <p>Faltam: RS 1.600,00</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default GoalCard;