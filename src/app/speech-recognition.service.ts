import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Inject } from '@angular/core';

declare var SpeechRecognition: any;
declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class SpeechRecognitionService {
  private recognition: any;
  private isListening = false;

  transcript$ = new BehaviorSubject<string>('');

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const SpeechRecognitionImpl = SpeechRecognition || webkitSpeechRecognition;

      if (SpeechRecognitionImpl) {
        this.recognition = new SpeechRecognitionImpl();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          this.transcript$.next(transcript);
        };

        this.recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          if (event.error === 'not-allowed') {
            this.transcript$.next('Microphone permission denied. Please allow access to continue.');
          } else if (event.error === 'no-speech') {
            this.transcript$.next('No speech detected. Try speaking again.');
          }
          this.isListening = false;
        };

        this.recognition.onend = () => {
          this.isListening = false;
        };
      } else {
        console.error('Speech recognition not supported in this browser.');
        this.transcript$.next('Speech recognition not supported in this browser.');
      }
    } else {
      console.warn('Speech recognition is not available on the server.');
    }
  }

  start() {
    if (isPlatformBrowser(this.platformId) && !this.isListening && this.recognition) {
      this.recognition.start();
      this.isListening = true;
      console.log('Speech recognition started.');
    }
  }

  stop() {
    if (isPlatformBrowser(this.platformId) && this.isListening && this.recognition) {
      this.recognition.stop();
      this.isListening = false;
      console.log('Speech recognition stopped.');
    }
  }
}