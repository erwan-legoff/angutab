export interface NoteDto {
  name: string;
  midi: number;
}

export interface PlayedNoteDto {
  note?: NoteDto;
  timeBeforeStart: number;
  duration: number;
}

export interface TabNoteDto {
  playedNote: PlayedNoteDto;
  caseNumber?: number;
}

export interface TabLineDto {
  root: NoteDto;
  melody: TabNoteDto[];
  maxCaseNumber: number;
  mustCorrectTime: boolean;
}

export interface FretBoardDto {
  tabLines: TabLineDto[];
  tuning: Record<string, unknown>;
}

export interface TabDto {
  fretBoard: FretBoardDto;
  tabToString: string;
}
