import { ArrowUp } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

type ReportTypeCardProps = {
    title: string;
    desc: string;
    isSelected: boolean;
    onSelect: () => void;
};

export function ReportTypeCard({ title, desc, isSelected, onSelect}: ReportTypeCardProps){

  return (
    <div className={`gap-3 w-[300px] flex gap-5 border-2 border-green-padrao ${isSelected && "bg-green-padrao-25"} rounded-sm p-3`}>
        <div className="flex gap-3">
            <div>
                <ArrowUp className="bg-green-padrao-25 text-green-padrao w-[30px] h-[30px] rounded-sm"/>
            </div>
            <div>
                <span>{ title }</span>
                <p className="text-text-padrao">{ desc }</p>
            </div>
        </div>
        <div>
            <Checkbox 
                checked={isSelected} 
                onCheckedChange={() => onSelect()} 
                className="cursor-pointer"
            />
        </div>
    </div>
  );
}

export default ReportTypeCard;