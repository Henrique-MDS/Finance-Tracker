
import { Input } from "../ui/input";

type NewGoal = {
  title: string;
  placeholder?: string;
  desc?: string;
}

export function NewGoalInput({ title, placeholder, desc}:NewGoal) {
  return (
    <div className="flex flex-col gap-2">
        <p>{title}</p>
        <Input className="p-5" placeholder={placeholder} style={{border: "1px solid #1e2939"}}/>
        <p className="text-sm text-text-padrao">{desc}</p>
    </div>
  );
}

export default NewGoalInput;