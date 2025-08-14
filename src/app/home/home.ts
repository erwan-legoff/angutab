import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { TabDto } from '../tab/dto/tab.dto';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private http = inject(HttpClient);
  tabs$ = this.http.post<TabDto>('http://localhost:3000/tabs',{});
}
