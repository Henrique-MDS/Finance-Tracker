import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCategoryTotals } from "@/Utils/callGetCategoryTotals";
import { notify } from "@/Utils/notify";
import { generateColor } from "@/Utils/generateColor";
import { getTotalByType } from "@/Utils/callGetTotalByType";
import { useAuth } from "@/Utils/AuthContext";

type TotalCategory = {
    category_name: string;
    total: number;
}

export default function DonutChart() {
    const { user, loading } = useAuth();
    if (loading) {
    return <div>Carregando...</div>;
    }
    if (!user) {
    return <Navigate to="/Login" replace />;
    }
    const userId = user.id;

    const [totalDespesasCat, setTotalDespesasCat] = useState<TotalCategory[]>([{category_name: '', total: 0}]);
    const [totalDespesa, setTotalDespesa] = useState<any>(0);

    useEffect(() => {
        const getTotalDespesasByCategory = async () => {
            const response = await getCategoryTotals(
                userId,
                "Despesa",
                null,
                null
            )
            
            if(!response.success){
                notify.error("Erro ao buscar total por categoria");
                return;
            } else {
                if(response && response.data){
                    setTotalDespesasCat(response.data);
                    return;
                } else {
                    notify.error("Nenhum dado a ser exibido");
                    return;
                }
            }
        }

        const fetchTotalByType = async () => {
            const response = await getTotalByType(
                userId,
                "Despesa",
                null,
                null
            )
            
            if(!response.success){
                notify.error("Erro ao buscar total por categoria");
                return;
            } else {
                if(response && response.data !== undefined){
                    setTotalDespesa(response.data);
                    return;
                } else {
                    notify.error("Nenhum dado a ser exibido");
                    return;
                }
            }
        }

        fetchTotalByType();
        getTotalDespesasByCategory();
    }, [])

    return (
        <div className="bg-dark-padrao rounded-xl p-5 h-full">
            <h2 className="text-white text-xl">Resumo das Despesas</h2>
            <div className="flex items-center h-full flex-col sm:flex-row lg:flex-row">
                <div className="relative w-[300px] h-[300px]">
                    <ResponsiveContainer>
                        <PieChart>
                        <Pie
                            data={totalDespesasCat}
                            dataKey="total"
                            innerRadius={70}
                            outerRadius={100}
                        >
                            {totalDespesasCat.map((_, index) => (
                            <Cell key={index} fill={generateColor(index)} />
                            ))}
                        </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-sm text-text-padrao">Total</span>
                        <span className="text-2xl font-bold">R$ {totalDespesa}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2 max-h-66 overflow-y-auto scrollbar-hide">
                    {totalDespesasCat.map((item, index) => {
                        const percentage = (
                            (item.total / totalDespesa) * 100
                        ).toFixed(1);

                        return (
                            <div
                                key={item.category_name}
                                className="flex items-center justify-between gap-3"
                            >
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                        backgroundColor: generateColor(index),
                                    }}
                                />

                                <span>{item.category_name.length > 15 ? item.category_name.slice(0, 15) + "..." : item.category_name}</span>
                            </div>

                            <span>{percentage}%</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}