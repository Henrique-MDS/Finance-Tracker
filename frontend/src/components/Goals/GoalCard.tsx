import { Calendar, Laptop } from "lucide-react";


export function GoalCard() {
  return (
    <div className="flex gap-3 w-[450px] bg-[#0B1723] p-5 rounded-xl">
        <div>
            <Laptop size={50}/>
        </div>
        <div>
            <div>                                
                <p>Comprar Notebook</p>                                
                <div className="flex items-center gap-1">
                    <Calendar />
                    <p>Meta até 20/12/2026</p>
                </div>
            </div>
            <div>
                barra
                <div className="flex justify-between">
                    <span>
                        <p>RS 3.400,00</p>
                        <p>de 5.000,00</p>
                    </span>
                    <p>Faltam: RS 1.600,00</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default GoalCard;