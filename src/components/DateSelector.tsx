import { ParsedDate } from "@/types/listing";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface DateSelectorProps {
  dates: ParsedDate[];
  selectedDate: string | null;
  onDateChange: (dateStr: string) => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const DateSelector = ({ dates, selectedDate, onDateChange }: DateSelectorProps) => {
  // Group dates by month
  const datesByMonth = dates.reduce((acc, date) => {
    const monthKey = `${date.year}-${date.month}`;
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(date);
    return acc;
  }, {} as Record<string, ParsedDate[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Calendar className="h-4 w-4" />
        <span>Select Date</span>
      </div>
      
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {Object.entries(datesByMonth).map(([monthKey, monthDates]) => {
          const firstDate = monthDates[0];
          const monthName = MONTHS[firstDate.month - 1];
          
          return (
            <div key={monthKey} className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">
                {monthName} {firstDate.year}
              </h3>
              <div className="grid grid-cols-7 gap-1">
                {monthDates.map(date => (
                  <Button
                    key={date.dateString}
                    variant={selectedDate === date.dateString ? "default" : "outline"}
                    size="sm"
                    className="h-9 w-9 p-0"
                    onClick={() => onDateChange(date.dateString)}
                  >
                    {date.day}
                  </Button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
