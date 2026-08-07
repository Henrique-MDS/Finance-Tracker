import { Settings } from "lucide-react";

type SettingsHeader = {
    theme: string;
    title: string;
}


export function SettingsHeader({ theme, title }: SettingsHeader) {

  return (
    <div className="flex items-center gap-3">
        <div className={`${theme} w-fit p-1 rounded-full`}>
            <Settings color="#ffffff"/>
        </div>
        <p className="text-white">{title}</p>
    </div>
  );
}

export default SettingsHeader;