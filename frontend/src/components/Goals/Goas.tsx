import { Flag, Goal as GoalIcon, Plus, Trophy } from "lucide-react";
import { Separator } from "@/components/ui/separator"
import GoalCard from "./GoalCard";
import { Button } from "../ui/button";
import { useAuth } from "@/Utils/AuthContext";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getData } from "@/Utils/getData";
import { notify } from "@/Utils/notify";
import type { Goal } from "@/types/generalTypes";

 type GoalInfo = {
  activeGoals: number;
  completedGoals: number;
  totalGoals: number;
} 

export function GoalsPage() {

    const { user, loading } = useAuth();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [goalInfo, setGoalInfo] = useState<GoalInfo>({activeGoals: 0, completedGoals: 0, totalGoals: 0});

    useEffect(() => {
        if(!user) return;

        const getGoals = async () => {
            const response = await getData("Goals", {user_id: user.id}, "Buscar metas do usuário");

            if(response.success){
                if(response && response.data){
                    setGoals(response.data);
                }
            } else {
                notify.error("Erro ao buscar metas");
                return;
            }
        }

        getGoals();

        const getGoalsInfo = (goals:Goal[]) => {
            if(goals.length == 0){
                return {
                    "activeGoals": 0,
                    "completedGoals": 0,
                    "totalGoals": 0
                };
            }

            let activeGoals = 0;
            let completedGoals = 0;
            let totalGoals = 0;

            goals.forEach(goal => {
                totalGoals += 1;
                if(goal.status == "em_andamento"){
                    activeGoals += 1;
                }

                if(goal.status == "concluido"){
                    completedGoals += 1;
                }
            });

            return {
                "activeGoals": activeGoals,
                "completedGoals": completedGoals,
                "totalGoals": totalGoals
            };
        }

        setGoalInfo(getGoalsInfo(goals));
    }, [])

    if (loading) {
        return <div>Carregando...</div>;
    }
    if (!user) {
        return <Navigate to="/Login" replace />;
    }

  return (
    <div className="flex flex-col gap-5 h-full">
        <div className="flex items-center gap-3">
            <GoalIcon color="#2CAE60" size={32}/>
            <div>
                <h1 className="text-2xl text-white">Metas Financeiras</h1>
                <p>Acompanhe o progresso de seus objetivos</p>
            </div>
        </div>
        <Separator />
        <div className="flex gap-5">
            <div className="w-[60%] flex flex-col gap-3 h-full">
                <h2 className="font-semibold text-xl text-white">Minhas Metas</h2>
                <div className="flex flex-col gap-3 max-h-96 overflow-y-auto scrollbar-hide">
                    {goals.length > 0 ? (
                        goals.map((goal) => (
                            <GoalCard key={goal.id} goal={goal}/>
                        ))
                    ) : (
                        <div>
                            sem objetivos
                        </div>
                    )}
                </div>
                <div className="w-full" style={{border: "3px dashed #2CAE60", borderRadius: "20px"}}>
                    <Button className="w-full p-10 bg-transparent hover:bg-transparent cursor-pointer text-[#2CAE60]">
                        <Plus />
                        Criar nova meta
                    </Button>
                </div>
            </div>
            <div className="w-[30%] flex flex-col gap-3 h-full">
                <h2 className="font-semibold text-xl text-white">Resumo das Metas</h2>
                <div className="flex flex-col gap-5 max-h-96 overflow-y-auto scrollbar-hide bg-[#0B1723] p-5 rounded-xl">
                    <div className="flex items-center gap-4">
                        <GoalIcon size={40} color="#2C8E34"/>
                        <div>
                            <p className="text-sm">Metas Ativas</p>
                            <span className="text-xl font-semibold">{goalInfo.activeGoals}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Trophy size={40} color="#1F6FEB"/>
                        <div>
                            <p className="text-sm">Metas Concluídas</p>
                            <span className="text-xl font-semibold">{goalInfo.completedGoals}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Flag size={40} color="#A970FF"/>
                        <div>
                            <p className="text-sm">Total de Metas</p>
                            <span className="text-xl font-semibold">{goalInfo.totalGoals}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default GoalsPage;