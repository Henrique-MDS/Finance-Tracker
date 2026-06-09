import ResumeCard from "./ResumeCards/ResumeCard";

export function MainPage() {
  
  return (
    <div className="p-5">
      <h1 className="text-2xl text-gray-300 font-medium">Dasboard</h1>
      <p>Visão geral de suas finanças</p>
      <div className="py-3 flex gap-3 flex-wrap">
        <ResumeCard title="Saldo atual" value={2500} desc="+12% em relação ao mês anterior" 
                    emoji="💵" themeColor="#2CAE60" bgColor="#12302F"/>
        <ResumeCard title="Saldo atual" value={2500} desc="+12% em relação ao mês anterior" 
                    emoji="💵" themeColor="#2CAE60" bgColor="#12302F"/>
        <ResumeCard title="Saldo atual" value={2500} desc="+12% em relação ao mês anterior" 
                    emoji="💵" themeColor="#2CAE60" bgColor="#12302F"/>
        
      </div>
    </div>
  );
}

export default MainPage;