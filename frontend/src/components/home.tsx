import ResumeCard from "./ResumeCards/ResumeCard";
import DonutChart from "./Graphs/pieChart";
import BarGraph from "./Graphs/barGraph";

export function MainPage() {
  
  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl text-gray-300 font-medium">Dasboard</h1>
          <p>Visão geral de suas finanças</p>
        </div>
        <div>
          
        </div>
      </div>      
      <div className="py-3 flex gap-3 flex-wrap">
        <ResumeCard title="Saldo atual" value={2500} desc="+12% em relação ao mês anterior" 
                    emoji="💵" themeColor="#2CAE60" bgColor="#12302F"/>
        <ResumeCard title="Saldo atual" value={2500} desc="+12% em relação ao mês anterior" 
                    emoji="💵" themeColor="#2CAE60" bgColor="#12302F"/>
        <ResumeCard title="Saldo atual" value={2500} desc="+12% em relação ao mês anterior" 
                    emoji="💵" themeColor="#2CAE60" bgColor="#12302F"/>
        
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="w-full lg:flex-1">
          <DonutChart />
        </div>

        <div className="w-full lg:flex-1">
          <BarGraph />
        </div>
      </div>
    </div>
  );
}

export default MainPage;