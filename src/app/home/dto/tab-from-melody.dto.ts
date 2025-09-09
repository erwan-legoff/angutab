import { PlayedNoteDto } from './tab.dto';

export interface TabFromMelodyDto {
  playedNotes: PlayedNoteDto[];
  beatPerMinute: number;
  tabName: string;
}
