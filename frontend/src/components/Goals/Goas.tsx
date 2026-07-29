import { Goal } from "lucide-react";
import { Separator } from "@/components/ui/separator"
import GoalCard from "./GoalCard";


export function GoalsPage() {
  return (
    <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
            <Goal color="#2CAE60" size={32}/>
            <div>
                <h1 className="text-2xl text-white">Metas Financeiras</h1>
                <p>Acompanhe o progresso de seus objetivos</p>
            </div>
        </div>
        <Separator />
        <div className="flex">
            <div className="w-[50%] flex flex-col gap-3">
                <h2 className="font-semibold text-xl text-white">Minhas Metas</h2>
                <div className="flex flex-col gap-3">
                    <GoalCard />
                </div>
            </div>
            <div>
                <div>
                    resumo das metas
                </div>
            </div>
        </div>
    </div>
  )
}

export default GoalsPage;