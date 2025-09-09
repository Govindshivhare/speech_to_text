import { Component, OnDestroy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpeechRecognitionService } from './speech-recognition.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
//  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnDestroy {
  title = signal('Speech-to-Text Trancript generator'); // Updated to match app.html
  transcript = '';
  error = '';
  private subscription: Subscription;

  constructor(private speechService: SpeechRecognitionService) {
    this.subscription = this.speechService.transcript$.subscribe(text => {
      this.transcript = text; 
      this.error = ''; 
    });
  }

  start() {
    this.error = '';
    this.speechService.start();
  }

  stop() {
    this.speechService.stop();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}