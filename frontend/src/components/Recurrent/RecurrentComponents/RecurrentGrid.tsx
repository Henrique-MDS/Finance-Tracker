import type { RecurrentTable } from "@/types/generalTypes";
import { useAuth } from "@/Utils/AuthContext";
import { formatDate } from "@/Utils/formatDate";
import { formatCurrencyBR } from "@/Utils/formateToBr";
import { getData } from "@/Utils/getData";
import { notify } from "@/Utils/notify";
import { Dessert, Dot } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export function RecurrentGrid(recurrentData:RecurrentTable) {

    const { user, loading } = useAuth();
    const [catName, setCatName] = useState("");

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!user) {
        return <Navigate to="/Login" replace />;
    }

    const getCategoryName = async () => {
        const response = await getData("Categories", {user_id: user.id, id: recurrentData.category_id}, "buscar nome categoria");

        if(response.success){
            if(response.data && response.data.length > 0){
                setCatName(response.data[0].name);
            } else {
                setCatName("Categoria não encontrada");
            }
        } else {
            notify.error("Erro ao buscar categoria");
            return;
        }
    }

    useEffect(() => {
        getCategoryName();
    }, [user.id])
    
  return (
    <div>
        <div className="grid grid-cols-6 items-center text-white">
            <div className="flex gap-2 items-center">
                <div className="bg-green-padrao p-2 rounded-full">
                    <Dessert />
                </div>
                <div>
                    <p>{recurrentData.desc}</p>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <Dot size={40}/>
                <p>{catName}</p>
            </div>
            <div>
                <p>{formatCurrencyBR(recurrentData.value)}</p>
            </div>
            <div>
                <p>{recurrentData.frequency}</p>
            </div>
            <div>
                <p>{formatDate(recurrentData.next_execution)}</p>
            </div>
            <div>
                <p className="bg-green-padrao-25 w-fit px-3 rounded-sm">
                    {recurrentData.active ? "Ativa" : "Inativa"}
                </p>
            </div>
        </div>
    </div>
  );
}

export default RecurrentGrid;