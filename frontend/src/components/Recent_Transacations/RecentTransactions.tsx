import { Separator } from "@/components/ui/separator"

export function RecentTransactions() {
  
  
  return (
    <div className="flex flex-col gap-3">
        <div className="flex justify-between">
            <div className="flex gap-3">
                <div className="bg-emerald-400 p-2 h-fit rounded-full">
                    🛒
                </div>
                <div>
                    <p className="text-gray-300">Supermercado Extra</p>
                    <p className="text-sm">Alimentação</p>
                </div>
            </div>
            <div>
                <p className="text-red-700">- R$ 156,80</p>
                <p>30/06/2026</p>
            </div>
        </div>
        <Separator className="bg-gray-800"/>
    </div>
  );
}

export default RecentTransactions;