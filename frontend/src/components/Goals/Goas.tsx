import { Goal as GoalIcon, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator"
import GoalCard from "./GoalCard";
import { Button } from "../ui/button";
import { useAuth } from "@/Utils/AuthContext";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getData } from "@/Utils/getData";
import { notify } from "@/Utils/notify";
import type { Goal } from "@/types/generalTypes";


export function GoalsPage() {

    const { user, loading } = useAuth();
    const [goals, setGoals] = useState<Goal[]>([]);

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
        <div className="flex">
            <div className="w-[50%] flex flex-col gap-3 h-full">
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