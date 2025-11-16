import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface YearSelectorProps {
  years: number[];
  selectedYear: number | null;
  onYearChange: (year: number) => void;
}

export const YearSelector = ({ years, selectedYear, onYearChange }: YearSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Select Year</label>
      <Select 
        value={selectedYear?.toString() || ""} 
        onValueChange={(value) => onYearChange(parseInt(value, 10))}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a year..." />
        </SelectTrigger>
        <SelectContent>
          {years.map(year => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
