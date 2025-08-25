import { PlayedNoteDto } from "./tab.dto"

export interface TrackFromMelodyDto {
  playedNotes: PlayedNoteDto[]
  beatPerMinute: number
}
