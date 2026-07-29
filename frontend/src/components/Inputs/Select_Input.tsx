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
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectInput;