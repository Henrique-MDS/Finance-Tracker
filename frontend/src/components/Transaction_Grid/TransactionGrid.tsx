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

  return (
    <div className={`flex gap-5 p-5 rounded-xl items-center justify-between text-white shadow-2xl cursor-pointer`} style={{ backgroundColor: color }}>
        <div className="flex gap-5 items-center">
            <div className="flex items-center gap-3">
                <p className="flex items-center gap-2">
                    <span className="p-1 rounded-full" style={{ backgroundColor: arrowBgColor }}>
                        <img src={transactionProps.type == "Receita" ? upArrow : downArrow} alt="arrow icon" />
                    </span>
                    {transactionProps.value}
                </p>
                <div>
                    <p>{transactionProps.specificCat && transactionProps.specificCat.name}</p>
                </div>
            </div>
            <div>
                <p>{transactionProps.desc}</p>
            </div>
        </div>        
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
                <Button className="cursor-pointer flex items-center border-2">
                    <span>
                        <img src={editPen} alt="pen icon" className="w-[20px]"/>
                    </span>
                    Editar
                </Button>
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