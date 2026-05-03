import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export function InputField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
}: InputFieldProps) {
  return (
    <div className="space-y-3">
      <Label htmlFor={id} className="block">
        {label}
        {required && <span className="text-red-500 ml-1.5 font-bold">•</span>}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={error ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20" : ""}
      />
      {error && <p className="text-sm font-medium text-red-600 flex items-center gap-1">{error}</p>}
    </div>
  );
}
