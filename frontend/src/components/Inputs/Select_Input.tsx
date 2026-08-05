import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SelectOption {
  label: string;
  value: string;
}

interface SelectInputProps {
  label: string;
  placeholder: string;
  options: SelectOption[];
  value?: string
  onValueChange?: (value: string) => void;
}

export function SelectInput({
  label,
  placeholder,
  options,
  value,
  onValueChange
}: SelectInputProps) {
  return (
    <div className="flex flex-col gap-3">
      <p>{label}</p>

      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger className="w-full p-5" style={{border: "1px solid #1e2939"}}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectInput;