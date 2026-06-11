import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { getData } from "../../Utils/getData";
import { useEffect, useState } from "react";

const data = [
  { name: "Receitas", value: 5000 },
  { name: "Despesas", value: 3000 },
  { name: "Alimentação", value: 10000 },
];

const COLORS = ["#22c55e", "#ef4444", "#ef4400"];



export default function DonutChart() {

    interface Transaction {
        cat_id: string
        created_at: Date
        desc: string
        id: string
        tran_date: Date
        type: string
        user_id: string
        value: number
    }

    const [transData, setTransdata] = useState<Transaction[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            let data = await getData("Transactions", {user_id: "91c6fb66-af21-46bb-bb98-bf9aab96ea6b"}, "get transaction");
            if(data != null){
                setTransdata(data);
            }
        }
        fetchData();
    }, [])
    console.log(transData)

  return (
    <div className="bg-[#0E1621] rounded-xl flex items-center p-3">
        <div className="relative w-[300px] h-[300px]">
            <ResponsiveContainer>
                <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    innerRadius={70}
                    outerRadius={100}
                >
                    {data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                    ))}
                </Pie>
                </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm text-gray-400">Total</span>
                <span className="text-2xl font-bold">R$ 8.000</span>
            </div>
        </div>
        <div>
            dasdasd
        </div>
    </div>
  );
}