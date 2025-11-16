import { ProgrammeEntry, ParsedDate } from '@/types/listing';

export const parseCSV = (csvText: string): ProgrammeEntry[] => {
  const lines = csvText.split('\n');
  const entries: ProgrammeEntry[] = [];
  
  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.split(';');
    if (parts.length >= 8) {
      entries.push({
        diaSemana: parts[0],
        data: parts[1],
        hora: parts[2],
        bloco: parts[3],
        programa: parts[4],
        estreia: parts[5],
        fonte: parts[6],
        obs: parts[7],
      });
    }
  }
  
  return entries;
};

export const parseDate = (dateStr: string): ParsedDate | null => {
  // Format: DD/MM/YYYY
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  
  return {
    day,
    month,
    year,
    dateString: dateStr,
  };
};

export const getAvailableYears = (entries: ProgrammeEntry[]): number[] => {
  const years = new Set<number>();
  
  entries.forEach(entry => {
    const parsed = parseDate(entry.data);
    if (parsed) {
      years.add(parsed.year);
    }
  });
  
  return Array.from(years).sort((a, b) => a - b);
};

export const getAvailableDates = (entries: ProgrammeEntry[], year: number): ParsedDate[] => {
  const dates = new Map<string, ParsedDate>();
  
  entries.forEach(entry => {
    const parsed = parseDate(entry.data);
    if (parsed && parsed.year === year) {
      dates.set(parsed.dateString, parsed);
    }
  });
  
  return Array.from(dates.values()).sort((a, b) => {
    const dateA = new Date(a.year, a.month - 1, a.day);
    const dateB = new Date(b.year, b.month - 1, b.day);
    return dateA.getTime() - dateB.getTime();
  });
};

export const filterByDate = (entries: ProgrammeEntry[], dateStr: string): ProgrammeEntry[] => {
  return entries.filter(entry => entry.data === dateStr);
};
