export interface ProgrammeEntry {
  diaSemana: string;
  data: string;
  hora: string;
  bloco: string;
  programa: string;
  estreia: string;
  fonte: string;
  obs: string;
}

export interface ParsedDate {
  day: number;
  month: number;
  year: number;
  dateString: string;
}
