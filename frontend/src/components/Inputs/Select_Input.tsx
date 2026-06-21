import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SelectInputProps {
  label: string;
  placeholder: string;
  options: string[];
}

export function SelectInput({label, placeholder, options}:SelectInputProps){
  
  return (
    <div className="flex flex-col gap-3">
        <p>{label}</p>
        <Select>
        <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                {
                    options.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))
                }
            </SelectGroup>
        </SelectContent>
        </Select>
    </div>
  );
}

export default SelectInput;