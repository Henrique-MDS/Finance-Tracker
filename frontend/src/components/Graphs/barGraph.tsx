import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { categoria: "Alimentação", valor: 800 },
  { categoria: "Transporte", valor: 300 },
  { categoria: "Lazer", valor: 500 },
  { categoria: "Moradia", valor: 1200 },
];

export default function BarGraph() {
  return (
    <div className="relative bg-[#0E1621] rounded-xl p-3">
        <div className="">
            <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="categoria" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="valor" name="Despesas" />
            </BarChart>
            </ResponsiveContainer>
        </div>        
    </div>
    
  );
}