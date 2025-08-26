import { NoteDto } from './tab.dto';
export type Compositors = 'RANDOM_SIMPLE' | 'SIMPLE_DOWN_ARPEGGIO';

export class GenerateMelodyDto {
  compositor?: Compositors;
  notesCount?: number;
  tempo?: number;
  scale?: string;
  key?: NoteDto;
}
