import { PlayedNoteDto } from "./tab.dto";

export interface TrackDto {
  playedNotes: PlayedNoteDto[];
  beatPerMinute: number;
}