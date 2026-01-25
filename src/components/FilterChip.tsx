import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function FilterChip({ label, active = false, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "filter-chip",
        active && "active"
      )}
    >
      {label}
    </button>
  );
}

interface FilterChipGroupProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterChipGroup({ options, value, onChange }: FilterChipGroupProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {options.map((option) => (
        <FilterChip
          key={option}
          label={option}
          active={value === option}
          onClick={() => onChange(option)}
        />
      ))}
    </div>
  );
}
