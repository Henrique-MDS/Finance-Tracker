import { type LucideIcon } from "lucide-react";

type Props = {
    title: string;
    desc: string;
    info: string;
    color: string;
    icon: LucideIcon;
}

export function RecurrentCard({ title, desc, info, color, icon }: Props) {
    const Icon = icon;

  return (
    <div className="flex gap-3 p-5 w-full rounded-xl" style={{border: "1px solid #111820"}}>
        <div className={`${color} h-fit p-3 rounded-full`}>
            <Icon color="#ffffff"/>
        </div>
        <div className="flex flex-col gap-1">
            <p>{ title }</p>
            <span className="text-xl font-bold">{ desc }</span>
            <p>{ info }</p>
        </div>
    </div>
  );
}

export default RecurrentCard;