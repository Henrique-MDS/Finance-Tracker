import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/Utils/formatDate";
import { generateColor } from "@/Utils/generateColor";
import { defaultIcons } from "@/Utils/icons";

type RecentTransaction = {
  id: string;
  desc: string;
  value: number;
  tran_date: string;
  type: string;
  category_name: string;
  icon: string;
}

type RecentTransactionProps = {
  transaction: RecentTransaction;
}

export function RecentTransactions({ transaction }:RecentTransactionProps) {
    const defitColor  = "#EF4444";
    const profitColor = "#2CAE60";
    const icon = defaultIcons.find( (item) => item.name === transaction.icon) ?? defaultIcons[9];
    const Icon = icon.icon;
    const iconColor = icon.color;
  return (
    <div className="flex flex-col gap-3">
        <div className="flex justify-between">
            <div className="flex gap-3">
                <div className="p-2 h-fit rounded-full" style={{backgroundColor: iconColor}}>
                    <Icon className="text-white"/>
                </div>
                <div>
                    <p className="text-gray-300">{transaction.desc}</p>
                    <p className="text-sm">{transaction.category_name}</p>
                </div>
            </div>
            <div>
                <p style={{color: transaction.type == "Receita" ? profitColor : defitColor}}>
                    <span>{transaction.type == "Receita" ? "+ " : "- "}</span>{transaction.value}
                </p>
                <p>{formatDate(transaction.tran_date)}</p>
            </div>
        </div>
        <Separator className="bg-gray-800"/>
    </div>
  );
}

export default RecentTransactions;