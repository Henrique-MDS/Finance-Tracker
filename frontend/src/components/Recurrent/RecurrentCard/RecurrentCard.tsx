import { type LucideIcon } from "lucide-react";

type Props = {
    title: string;
    desc: string | number;
    info: string;
    color: string;
    icon: LucideIcon;
}

export function RecurrentCard({ title, desc, info, color, icon }: Props) {
    const Icon = icon;

  return (
    <div className="flex items-start gap-3 p-4 sm:p-5 w-full h-full min-w-0 rounded-xl" style={{border: "1px solid var(--border)"}}>
        <div className={`${color} shrink-0 p-2 sm:p-3 rounded-full`}>
            <Icon color="#ffffff" className="size-5 sm:size-6"/>
        </div>
        <div className="flex flex-col gap-1 min-w-0">
            <p className="text-sm sm:text-base leading-tight">{ title }</p>
            <span className="text-lg sm:text-xl font-bold break-words">{ desc }</span>
            <p className="text-sm text-text-padrao leading-tight">{ info }</p>
        </div>
    </div>
  );
}

export default RecurrentCard;