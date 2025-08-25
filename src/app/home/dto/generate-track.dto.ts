import { GenerateMelodyDto } from './generate-melody.dto';

export interface GenerateTrackDto {
  generateMelodyDto?: GenerateMelodyDto;
  tabName: string;
}
