import { formatDate } from "@/Utils/formatDate";
import upArrow from "../../assets/up-arrow-icon.svg";
import downArrow from "../../assets/down-arrow-icon.svg";
import editPen from "../../assets/edit-pen-icon.svg";
import trash from "../../assets/trash-icon.svg";
import { Button } from "../ui/button";
import { deleteData } from "@/Utils/deleteData";
import { notify } from "@/Utils/notify";

type Category = {
  created_at: string;
  id: string;
  name: string;
  updated_at: string;
  user_id: string;
}

type Transaction = {
    cat_id: string;
    created_at: string;
    desc: string;
    id: string;
    tran_date: string;
    type: string;
    user_id: string;
    value: string;
    specificCat?: Category | null;
}

type TransactionGridProps = {
  transactionProps: Transaction;
  onDelete: () => Promise<void>;
};

export function TransactionGrid({transactionProps, onDelete}:TransactionGridProps) {
  
    const formattedDate = formatDate(transactionProps.tran_date);
    let color = transactionProps.type == "Receita" ? "#0C1D1D" : "#1D1218";
    let arrowBgColor = transactionProps.type == "Receita" ? "#0F402C" : "#552021";
    const transactionId = transactionProps.id;

    const deleteOnClick = async () => {
        const isDeleted = await deleteData(
            "Transactions",
            { id: transactionId },
            "Deletar transação"
        );

        if(isDeleted.success){
            notify.success("Transação excluída!");
            await onDelete();
            return;
        } else {
            notify.error("Erro ao excluir transação");
            return;
        }
    }
    console.log(transactionProps)
  return (
    <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-xl text-white shadow-2xl`} style={{ backgroundColor: color }}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 min-w-0">
            <div className="flex items-center gap-3">
                <p className="flex items-center gap-2">
                    <span className="p-1 rounded-full shrink-0" style={{ backgroundColor: arrowBgColor }}>
                        <img src={transactionProps.type == "Receita" ? upArrow : downArrow} alt="arrow icon" className="w-[30px] h-[30px]"/>
                    </span>
                    {transactionProps.type == "Receita" ? "+ " : "- "}
                    {transactionProps.value}
                </p>
                <div>
                    <p>{transactionProps.specificCat && transactionProps.specificCat.name}</p>
                </div>
            </div>
            <div className="flex-1">
                <p className="min-w-0 break-words">{transactionProps.desc}</p>
            </div>
        </div>        
        <div className="flex items-center gap-3 justify-end">
            <div className="flex items-center gap-2">
                <Button className="cursor-pointer flex items-center" onClick={() => deleteOnClick()}>
                    <span>
                        <img src={trash} alt="trash icon" className="w-[25px]"/>
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