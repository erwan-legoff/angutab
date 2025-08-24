import { PlayedNoteDto } from "./tab.dto";

export interface TabFromMelodyDto {
  playedNotes: PlayedNoteDto[]
  tabName: string;
}