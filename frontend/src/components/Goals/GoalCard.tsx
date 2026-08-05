import { Calendar, Pen, Plus, Trash, Banknote } from "lucide-react";
import { Progress } from "@/components/ui/progress"
import { Button } from "../ui/button";
import type { Goal } from "@/types/generalTypes";
import { formatDate } from "@/Utils/formatDate";
import { formatCurrencyBR } from "@/Utils/formateToBr";
import { generateColor } from "@/Utils/generateColor";
import { defaultIcons } from "@/Utils/icons";
import { deleteData } from "@/Utils/deleteData";
import { notify } from "@/Utils/notify";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator"
import AddMoneyModal from "./addMoney";
import { useState } from "react";

interface GoalCardProps {
    goal: Goal;
    percentage: number;
    index: number;
    refreshGoals: () => Promise<void>;
}

export function GoalCard({ goal, percentage, index, refreshGoals }: GoalCardProps) {

    const progress = percentage;
    const mainColor = generateColor(index);
    const mainColorTransparent = generateColor(index, 0.25);
    const goalIcon = defaultIcons.find( (item) => item.name === goal.icon) ?? defaultIcons[9];
    const Icon = goalIcon.icon
    const [addMoneyPopUp, setAddMoneyPopUp] = useState(false);

    const deleteGoal = async () => {
        const response = await deleteData("Goals", {id: goal.id}, "Excluir Meta");

        if(!response.success){
            notify.error("Erro ao excluir meta");
            return;
        }

        notify.success("Meta excluída!");
        await refreshGoals();
    }

  return (
    <div className="flex flex-col lg:flex-row gap-3 w-full bg-dark-padrao p-5 rounded-xl">
        <div className="h-fit w-fit p-3 rounded-xl" style={{backgroundColor: mainColorTransparent}}>
            <Icon size={50} color={mainColor}/>
        </div>
        <div className="w-full flex flex-col gap-3">
            <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center justify-between">
                    <p className="text-xl text-white">{goal.title}</p>
                    <div className="flex flex-col">
                        {goal.status == "em_andamento" ? (
                            <p className="text-2xl text-blue-padrao self-end bg-blue-padrao-25 p-1 rounded-sm">
                                {percentage}%
                            </p>
                        ) : (
                            <p className="text-2xl text-green-padrao self-end bg-green-padrao-25 p-1 rounded-sm">
                                {percentage}%
                            </p>
                        )}
                        
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
            <div className="flex flex-wrap lg:flex-nowrap items-center gap-3">                
                <Button 
                    className="cursor-pointer bg-green-padrao" onClick={() => setAddMoneyPopUp(true)}
                    style={goal.status == "em_andamento" ? { display: "flex" } : { display: "none" }}
                >
                    <Plus />
                    Adicionar Dinheiro
                </Button>                
                <Button 
                    className="cursor-pointer"
                    style={goal.status == "em_andamento" ? { display: "flex" } : { display: "none" }}
                >
                    <Pen />
                    Editar
                </Button> 
                <Button className="cursor-pointer bg-red-padrao" onClick={() => deleteGoal()}>
                    <Trash />
                    Excluir
                </Button> 
            </div>
        </div>
        <Dialog open={addMoneyPopUp} onOpenChange={setAddMoneyPopUp}>
            <DialogContent className="!max-w-4xl !h-[80vh] bg-dark-padrao text-white">
                <DialogHeader>
                <div className="flex items-center gap-3">
                    <Banknote size={60} color="#2CAE60" className="bg-green-padrao-25 p-2 rounded-full"/>
                    <DialogTitle className="text-xl">
                        Adicionar Dinheiro
                    </DialogTitle>
                </div>
                </DialogHeader>
                <p className="text-text-padrao">Adicione dinheiro em sua meta!</p>
                <Separator className="bg-gray-800"/>
                <AddMoneyModal refreshGoals={refreshGoals} goal={goal}/>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default GoalCard;