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
import NewGoalModal from "./newGoal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";


export function GoalsPage() {

    const { user, loading } = useAuth();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [newGoalPopUp, setNewGoalPopUp] = useState(false);
    //const [addMoneyPopUp, setAddMoneyPopUp] = useState(false);

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
    }, [user])

    if (loading) {
        return <div>Carregando...</div>;
    }
    if (!user) {
        return <Navigate to="/Login" replace />;
    }

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

    const goalsInfo = getGoalsInfo(goals);

    const calculatePercentage = (current: number, total: number): number => {
        if (total <= 0) return 0;
        return Number(Math.min((current / total) * 100, 100).toFixed(0));
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
                        goals.map((goal, i) => (
                            <GoalCard key={goal.id} goal={goal} percentage={calculatePercentage(goal.now_value, goal.goal_value)} index={i}/>
                        ))
                    ) : (
                        <div>
                            sem objetivos
                        </div>
                    )}
                </div>
                <div className="w-full" style={{border: "3px dashed #2CAE60", borderRadius: "20px"}}>
                    <Button className="w-full p-10 bg-transparent hover:bg-transparent cursor-pointer text-[#2CAE60]"
                            onClick={() => setNewGoalPopUp(true)}
                    >
                        <Plus />
                        Criar nova meta
                    </Button>
                </div>
            </div>
            <div className="w-[30%] flex flex-col gap-3 h-full">
                <h2 className="font-semibold text-xl text-white">Resumo das Metas</h2>
                <div className="flex flex-col gap-5 max-h-96 overflow-y-auto scrollbar-hide bg-[#0B1723] p-5 rounded-xl">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-padrao-25 p-1 rounded-sm">
                            <GoalIcon size={40} color="#2C8E34" />
                        </div>
                        <div>
                            <p className="text-sm">Metas Ativas</p>
                            <span className="text-xl font-semibold">{goalsInfo.activeGoals}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-padrao-25 p-1 rounded-sm">
                            <Trophy size={40} color="#1F6FEB"/>
                        </div>
                        <div>
                            <p className="text-sm">Metas Concluídas</p>
                            <span className="text-xl font-semibold">{goalsInfo.completedGoals}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-padrao-25 p-1 rounded-sm">
                            <Flag size={40} color="#A970FF"/>
                        </div>
                        <div>
                            <p className="text-sm">Total de Metas</p>
                            <span className="text-xl font-semibold">{goalsInfo.totalGoals}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div> 
        <Dialog open={newGoalPopUp} onOpenChange={setNewGoalPopUp}>
            <DialogContent className="!max-w-4xl !h-[80vh] bg-dark-padrao text-white">
                <DialogHeader>
                <div className="flex items-center gap-3">
                    <GoalIcon size={60} color="#2CAE60" className="bg-green-padrao-25 p-2 rounded-full"/>
                    <DialogTitle className="text-xl">
                        Nova Meta
                    </DialogTitle>
                </div>
                </DialogHeader>
                <p className="text-text-padrao">Crie uma meta para acompanhar seus objetivos</p>
                <Separator className="bg-gray-800"/>
                <NewGoalModal />
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default GoalsPage;