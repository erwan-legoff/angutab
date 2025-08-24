import { GenerateMelodyDto } from "./generate-melody.dto";

export interface GenerateTabDto {
  generateMelodyDto?: GenerateMelodyDto;
  tabName: string;
}
