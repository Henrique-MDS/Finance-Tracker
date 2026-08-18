import { supabase } from "@/services/supabase";
import { useAuth } from "@/Utils/AuthContext";
import { notify } from "@/Utils/notify";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ReportData = {
    tran_date: string; 
    receitas: number; 
    despesas: number; 
    saldo_acumulado: number;
    saldo_diario: number;
}

export function CashFlowReport({iniDate, finalDate}:{iniDate:string | null, finalDate:string | null}){

    const { user, loading } = useAuth();
    const [reportData, setReportData] = useState<ReportData[]>();

    if (loading) {
        return <div>Carregando...</div>;
    }
    if (!user) {
        return <Navigate to="/Login" replace />;
    }

    function formatDateToUS(date: string | null): string {
        if(!date || date == null){
            return "";
        }
        const [day, month, year] = date.split("/");

        return `${year}/${month}/${day}`;
    }

    const getReportData = async () => {
        const { data, error } = await supabase.rpc(
            "fluxo_de_caixa",
            {
                p_user_id: user.id,
                p_data_inicial: formatDateToUS(iniDate),
                p_data_final: formatDateToUS(finalDate),
            }
        );

        if(error){
            notify.error("Erro ao buscar fluxo de caixa");
            return;
        }

        setReportData(data)
    }
    
    useEffect(() => {
        getReportData();
    }, [user])
    
  return (
    <div className="bg-white text-black text-[10px] rounded-xl p-4" style={{ height: "400px" }}>
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={reportData}
                margin={{
                    top: 10,
                    right: 20,
                    left: 10,
                    bottom: 10,
                }}
            >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="dia" />

            <YAxis
                tickFormatter={(value) =>
                `R$ ${value}`
                }
            />

            <Tooltip
                formatter={(value) =>
                `R$ ${Number(value).toFixed(2)}`
                }
            />

            <Legend />

            <XAxis dataKey="tran_date" />

                <Line
                    type="monotone"
                    dataKey="receitas"
                    name="Entradas"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                />

                <Line
                    type="monotone"
                    dataKey="despesas"
                    name="Saídas"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                />

                <Line
                    type="monotone"
                    dataKey="saldo_acumulado"
                    name="Saldo"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
  );
}

export default CashFlowReport;