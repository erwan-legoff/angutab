import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable, map, switchMap, shareReplay } from 'rxjs';
import { MelodyDto } from '../tab/dto/melody.dto';       // ton type: { playedNotes; beatPerMinute }
import { TabFromMelodyDto } from '../tab/dto/tab-from-melody.dto';
import { TabDto } from '../tab/dto/tab.dto';            // la réponse de tab (selon ton contrat)

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private http = inject(HttpClient);

  melody$: Observable<MelodyDto> =
    this.http.post<MelodyDto>('http://localhost:3000/melodies/preview/generate', {})
      .pipe(shareReplay(1));

  
  tab$: Observable<TabDto> =
    this.melody$.pipe(
      map((melody): TabFromMelodyDto => ({
        playedNotes: melody.playedNotes,
        tabName: 'preview-tab', 
      })),
      switchMap((dto) =>
        this.http.post<TabDto>('http://localhost:3000/tabs/preview/from-melody', dto)
      ),
      shareReplay(1)
    );
}
