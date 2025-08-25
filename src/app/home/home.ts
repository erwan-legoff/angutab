import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable, map, switchMap, shareReplay } from 'rxjs';
import { MelodyDto } from './dto/melody.dto'; // ton type: { playedNotes; beatPerMinute }
import { TabFromMelodyDto } from './dto/tab-from-melody.dto';
import { TabDto } from './dto/tab.dto'; // la réponse de tab (selon ton contrat)
import { TrackFromMelodyDto } from './dto/track-from-melody.dto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private http = inject(HttpClient);
  private apiHost = 'http://localhost:3000';
  melody$: Observable<MelodyDto> = this.http
    .post<MelodyDto>(`${this.apiHost}/melodies/preview/generate`, {})
    .pipe(shareReplay(1));

  tab$: Observable<TabDto> = this.melody$.pipe(
    map(
      (melody): TabFromMelodyDto => ({
        playedNotes: melody.playedNotes,
        tabName: 'preview-tab',
      })
    ),
    switchMap((dto) => this.http.post<TabDto>(`${this.apiHost}/tabs/preview/from-melody`, dto)),
    shareReplay(1)
  );

  midi$: Observable<{ file: File; url: string }> = this.melody$.pipe(
    map(
      (melody): TrackFromMelodyDto => ({
        playedNotes: melody.playedNotes,
        beatPerMinute: melody.beatPerMinute,
      })
    ),
    switchMap((dto) =>
      this.http.post(`${this.apiHost}/tracks/preview/from-melody`, dto, {
        responseType: 'blob',
      })
    ),
    map((blob) => {
      const file = new File([blob], 'midi.midi');
      const url = URL.createObjectURL(file);
      return { file, url };
    })
  );
}
