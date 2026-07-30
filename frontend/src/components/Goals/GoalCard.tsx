import { Calendar, Laptop, Pen, Plus, Trash } from "lucide-react";
import { Progress } from "@/components/ui/progress"
import { Button } from "../ui/button";
import type { Goal } from "@/types/generalTypes";
import { formatDate } from "@/Utils/formatDate";
import { formatCurrencyBR } from "@/Utils/formateToBr";

interface GoalCardProps {
    goal: Goal;
    percentage: number;
}

export function GoalCard({ goal, percentage }: GoalCardProps) {

    const progress = percentage;

  return (
    <div className="flex gap-3 w-full bg-[#0B1723] p-5 rounded-xl">
        <div>
            <Laptop size={50}/>
        </div>
        <div className="w-full flex flex-col gap-3">
            <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center justify-between">
                    <p className="text-xl text-white">{goal.title}</p>
                    <div>
                        <p className="text-2xl">{percentage}%</p>
                        <p>{goal.status == "em_andamento" ? "Em Andamento" : "Concluído"}</p>
                    </div>                    
                </div>                     
                <div className="flex items-center gap-1">
                    <Calendar size={18}/>
                    <p>Meta até <span>{formatDate(goal.limit_date)}</span></p>
                </div>
            </div>
            <div className="w-full flex flex-col gap-3">
                <Progress value={progress} className="w-[100%]" />
                <div className="flex justify-between w-full">
                    <span>
                        <p className="text-white">{formatCurrencyBR(goal.now_value)}</p>
                        <p className="text-sm">de <span>{formatCurrencyBR(goal.goal_value)}</span></p>
                    </span>
                    <p>Faltam: <span className="text-white">{formatCurrencyBR(goal.goal_value - goal.now_value)}</span></p>
                </div>
            </div>
            <div className="flex items-center gap-3">                
                <Button className="cursor-pointer bg-[#2CAE60]">
                    <Plus />
                    Adicionar Dinheiro
                </Button>                
                <Button className="cursor-pointer">
                    <Pen />
                    Editar
                </Button> 
                <Button className="cursor-pointer bg-[#EF4444]">
                    <Trash />
                    Excluir
                </Button> 
            </div>
        </div>
    </div>
  )
}

export default GoalCard;