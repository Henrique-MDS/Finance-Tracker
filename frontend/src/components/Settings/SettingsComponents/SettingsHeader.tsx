import { FileQuestion } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SettingsHeader = {
  theme: string;
  title: string;
  icon?: LucideIcon;
}


export function SettingsHeader({ theme, title, icon:Icon }: SettingsHeader) {

  return (
    <div className="flex items-center gap-3">
      <div className={`${theme} w-fit p-1 rounded-full`}>
        {Icon ? <Icon color="#ffffff"/> : <FileQuestion />}
        
      </div>
      <p className="text-foreground">{title}</p>
    </div>
  );
}

export default SettingsHeader;