import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { getData } from "../../Utils/getData";
import { useEffect } from "react";

const data = [
  { name: "Receitas", value: 5000 },
  { name: "Despesas", value: 3000 },
  { name: "Alimentação", value: 10000 },
];

const COLORS = ["#22c55e", "#ef4444", "#ef4400"];



export default function DonutChart() {
    useEffect(() => {
        getData("Users", {id: "91c6fb66-af21-46bb-bb98-bf9aab96ea6b", name: "Delta"}, "get user");
    }, [])
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