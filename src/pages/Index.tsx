import { useState, useEffect } from "react";
import { ProgrammeEntry } from "@/types/listing";
import { parseCSV, getAvailableYears, getAvailableDates, filterByDate } from "@/utils/csvParser";
import { YearSelector } from "@/components/YearSelector";
import { DateSelector } from "@/components/DateSelector";
import { ProgrammeListing } from "@/components/ProgrammeListing";
import { Card } from "@/components/ui/card";
import { Tv2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const Index = () => {
  const [programmes, setProgrammes] = useState<ProgrammeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const {
    toast
  } = useToast();
  useEffect(() => {
    const loadCSV = async () => {
      try {
        const response = await fetch('/data/grelha.csv');
        if (!response.ok) {
          throw new Error('Failed to load CSV file');
        }
        const text = await response.text();
        const parsed = parseCSV(text);
        setProgrammes(parsed);

        // Auto-select first available year
        const years = getAvailableYears(parsed);
        if (years.length > 0) {
          setSelectedYear(years[0]);
        }
      } catch (error) {
        console.error('Error loading CSV:', error);
        toast({
          title: "Error loading data",
          description: "Could not load the TV listings. Please make sure the CSV file exists at /data/grelha.csv",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    loadCSV();
  }, [toast]);
  const availableYears = getAvailableYears(programmes);
  const availableDates = selectedYear ? getAvailableDates(programmes, selectedYear) : [];
  const filteredProgrammes = selectedDate ? filterByDate(programmes, selectedDate) : [];
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setSelectedDate(null);
  };
  const handleDateChange = (dateStr: string) => {
    setSelectedDate(dateStr);
  };
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading TV listings...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary">
              <Tv2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Programação Disney Channel  </h1>
              <p className="text-sm text-muted-foreground">Visualizador de grelhas de programação          </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            <Card className="p-6">
              <YearSelector years={availableYears} selectedYear={selectedYear} onYearChange={handleYearChange} />
            </Card>

            {selectedYear && availableDates.length > 0 && <Card className="p-6">
                <DateSelector dates={availableDates} selectedDate={selectedDate} onDateChange={handleDateChange} />
              </Card>}
          </aside>

          {/* Main content */}
          <div className="lg:col-span-2">
            {!selectedDate ? <Card className="p-12 text-center">
                <Tv2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Select a Date
                </h3>
                <p className="text-muted-foreground">
                  Choose a year and date from the sidebar to view TV listings
                </p>
              </Card> : <Card className="p-6">
                <ProgrammeListing programmes={filteredProgrammes} selectedDate={selectedDate} />
              </Card>}
          </div>
        </div>
      </main>
    </div>;
};
export default Index;