
import { Input } from "../ui/input";

type NewGoal = {
  title: string;
  type: string;
  placeholder?: string;
  desc?: string;
  value?:string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function NewGoalInput({ title, type, placeholder, desc, value, onChange}:NewGoal) {
  return (
    <div className="flex flex-col gap-2">
        <p>{title}</p>
        <Input 
          className="p-5" 
          placeholder={placeholder}
          type={type}
          style={{border: "1px solid #1e2939"}}
          value={value}
          onChange={onChange}
        />
        <p className="text-sm text-text-padrao">{desc}</p>
    </div>
  );
}

export default NewGoalInput;