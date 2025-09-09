import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable, map, switchMap, shareReplay } from 'rxjs';

import { MelodyDto } from './dto/melody.dto'; // { playedNotes; beatPerMinute }
import { TabFromMelodyDto } from './dto/tab-from-melody.dto';
import { TabDto } from './dto/tab.dto';
import { TrackFromMelodyDto } from './dto/track-from-melody.dto';
import { GenerateMelodyDto } from './dto/generate-melody.dto';
import { FindAllScalesDto } from './dto/find-all-scales.dto';

import * as Tone from 'tone';
import { Midi } from '@tonejs/midi';

import { signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

// ✅ Angular Material modules (standalone-ready)
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

// ✅ Angular forms
import { FormsModule } from '@angular/forms';
type PolySynth = Tone.PolySynth<Tone.Synth<Tone.SynthOptions>>;
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private http = inject(HttpClient);
  private apiHost = 'http://localhost:3000';
  melody$!: Observable<MelodyDto>;
  tab$!: Observable<TabDto>;
  midi$!: Observable<{ file: File; url: string }>;
  midiTone$!: Observable<Midi>;
  selectedScale = signal<string | undefined>(undefined);
  selectedNotesCount = signal<number>(50);
  synths: Array<PolySynth> = [];
  scales$!: Observable<FindAllScalesDto>;
  isPlaying = false;
  private readonly dto = computed<GenerateMelodyDto>(() => ({
    notesCount: this.selectedNotesCount(),
    scale: this.selectedScale(),
  }));
  ngOnInit(): void {
    this.initFilters();
    this.generate();
  }

  generate(): void {
    this.melody$ = this.http
      .post<MelodyDto>(`${this.apiHost}/melodies/preview/generate`, this.dto())
      .pipe(shareReplay(1));

    this.tab$ = this.melody$.pipe(
      map(
        (melody): TabFromMelodyDto => ({
          playedNotes: melody.playedNotes,
          tabName: 'preview-tab',
        })
      ),
      switchMap((body) => this.http.post<TabDto>(`${this.apiHost}/tabs/preview/from-melody`, body)),
      shareReplay(1)
    );

    this.midi$ = this.melody$.pipe(
      map(
        (melody): TrackFromMelodyDto => ({
          playedNotes: melody.playedNotes,
          beatPerMinute: melody.beatPerMinute,
        })
      ),
      switchMap((body) =>
        this.http.post(`${this.apiHost}/tracks/preview/from-melody`, body, {
          responseType: 'blob',
        })
      ),
      map((blob) => {
        const file = new File([blob], 'midi.mid');
        const url = URL.createObjectURL(file);
        return { file, url };
      }),
      shareReplay(1)
    );

    this.midiTone$ = this.midi$.pipe(
      switchMap(async (midi) => Midi.fromUrl(midi.url)),
      shareReplay(1)
    );
  }

  initFilters(): void {
    this.scales$ = this.http.get<FindAllScalesDto>(`${this.apiHost}/scales`).pipe(shareReplay(1));
  }

  /**
   * Will play any given midi thanks to tone.js
   * https://stackoverflow.com/questions/75227704/how-can-i-use-tone-js-to-play-a-midi-file
   * @param midi A midi file
   * @param param1 options for synth tone
   */
  async playMidi(midi: Midi, { attack = 0.002, decay = 0.1, sustain = 0.3, release = 1 } = {}) {
    const now = Tone.now() + 0.5;
    await Tone.start();
    this.disposeSynths();
    midi.tracks.forEach((track) => {
      const synth = this.initSynth({ attack, decay, sustain, release });
      this.synths.push(synth);
      track.notes.forEach((note) => {
        synth.triggerAttackRelease(note.name, note.duration, note.time + now, note.velocity);
      });
    });
    this.isPlaying = true;
  }
  disposeSynths() {
    this.synths.forEach((s) => s.dispose());
  }

  /**
   * Will return a tone.js synth according to your parameters
   * @param param0 options for the synth tone
   * @returns
   */
  private initSynth({ attack = 0.002, decay = 0.1, sustain = 0.3, release = 1 } = {}): PolySynth {
    return new Tone.PolySynth(Tone.Synth, {
      envelope: {
        attack,
        decay,
        sustain,
        release,
      },
    }).toDestination();
  }
}
