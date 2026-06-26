import { formatDate } from "@/Utils/formatDate";
import upArrow from "../../assets/up-arrow-icon.svg";
import downArrow from "../../assets/down-arrow-icon.svg";
import editPen from "../../assets/edit-pen-icon.svg";
import trash from "../../assets/trash-icon.svg";
import { Button } from "../ui/button";

type Transaction = {
    cat_id: string;
    created_at: string;
    desc: string;
    id: string;
    tran_date: string;
    type: string;
    user_id: string;
    value: string;
}

type TransactionGridProps = {
  transactionProps: Transaction;
};

export function TransactionGrid({transactionProps}:TransactionGridProps) {
  
    const formattedDate = formatDate(transactionProps.tran_date);
    let color = transactionProps.type == "Receita" ? "#0C1D1D" : "#1D1218";
    let arrowBgColor = transactionProps.type == "Receita" ? "#0F402C" : "#552021";

  return (
    <div className={`flex gap-5 p-5 rounded-xl items-center justify-between text-white shadow-2xl cursor-pointer`} style={{ backgroundColor: color }}>
        <div className="flex gap-5">
            <div>
                <p className="flex items-center gap-2">
                    <span className="p-1 rounded-full" style={{ backgroundColor: arrowBgColor }}>
                        <img src={transactionProps.type == "Receita" ? upArrow : downArrow} alt="arrow icon" />
                    </span>
                    {transactionProps.value}
                </p>
            </div>
            <div>
                <p>{transactionProps.desc}</p>
            </div>
        </div>        
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
                <Button className="cursor-pointer flex items-center border-2">
                    <span>
                        <img src={editPen} alt="" className="w-[20px]"/>
                    </span>
                    Editar
                </Button>
                <Button className="cursor-pointer flex items-center">
                    <span>
                        <img src={trash} alt="" className="w-[25px]"/>
                    </span>
                    Excluir
                </Button>
            </div>
            <p>{formattedDate}</p>
        </div>
    </div>
  );
}

export default TransactionGrid;