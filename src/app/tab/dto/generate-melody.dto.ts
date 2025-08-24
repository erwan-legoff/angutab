import { NoteDto } from "./tab.dto";


export class GenerateMelodyDto {
  notesCount?: number;
  tempo?: number;
  scale?: string;
  key?: NoteDto;
}
