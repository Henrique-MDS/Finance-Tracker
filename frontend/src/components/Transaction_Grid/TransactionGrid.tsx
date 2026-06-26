import { formatDate } from "@/Utils/formatDate";

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

  return (
    <div className="bg-[#013024] flex gap-5 p-5 rounded-xl items-center justify-between text-white">
        <div className="flex gap-5">
            <div>
                <p>+ {transactionProps.value}</p>
            </div>
            <div>
                <p>{transactionProps.desc}</p>
            </div>
        </div>        
        <div>
            <p>{formattedDate}</p>
        </div>
    </div>
  );
}

export default TransactionGrid;