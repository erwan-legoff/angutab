import { PlayedNoteDto } from "./tab.dto";

export interface MelodyDto {
  playedNotes: PlayedNoteDto[];
  beatPerMinute: number;
}