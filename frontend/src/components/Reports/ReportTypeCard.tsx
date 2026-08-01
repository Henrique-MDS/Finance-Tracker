import { ArrowUp } from "lucide-react";
import { Checkbox } from "../ui/checkbox";


export function ReportTypeCard(){

  return (
    <div className="gap-3 w-[300px] flex gap-5 border-2 border-green-padrao rounded-sm p-3">
        <div className="flex gap-3">
            <div>
                <ArrowUp className="bg-green-padrao-25 text-green-padrao w-[30px] h-[30px] rounded-sm"/>
            </div>
            <div>
                <span>Resumo Financeiro</span>
                <p className="text-text-padrao">Receitas, despesas, saldo e economia do período</p>
            </div>
        </div>
        <div>
            <Checkbox />
        </div>
    </div>
  );
}

export default ReportTypeCard;