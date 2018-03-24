import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AlzaHome';
  sounds = [
    { key: 'eat', url: 'https://translate.google.com/translate_tts?ie=UTF-8&tl=fr&client=tw-ob&q=Bonjour%20Carlen', description: 'Manger Midi' }
  ];

  play(event) {
    const audio = new Audio();
    const elem =this.sounds.find(e => e.key === event.key);
    if (elem === undefined) return;
    audio.src = elem.url; 
    audio.load();
    audio.play();
  }
}
