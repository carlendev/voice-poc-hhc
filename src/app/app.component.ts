import { Component, OnInit, Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AlzaHome';
  locale = 'FR-fr';
  name = 'Jaqueline';
  soundsSynth = [
    { key: 'eat', url: 'Bonjour Jacqueline il est midi il serait bien de manger', description: 'Manger Midi' },
    { key: 'morning', url: this.getDateSentence(), description: 'Matin' }
  ];
  sounds = [
    { key: 'eat', url: '/assets/audio_sentences/midday_sentence.wav', description: 'Manger Midi', one: false },
    { key: 'cooking', url: '/assets/audio_sentences/urgent_cookingdevice.wav', description: 'Plaques de cuison', one: false },
    { key: 'urgence', url: '/assets/audio_sentences/urgent_incominghelp.wav', description: 'Les urgences', one: false },
    { key: 'wakeup',  description: 'Le reveil', one: true, urls: [
      { type: 0, url: '/assets/audio_sentences/wakeup_sentence_p1.wav' },
      { type: 0, url: '/assets/audio_sentences/wakeup_sentence_p2.wav' },
      { type: 0, url: '/assets/audio_sentences/wakeup_sentence_p3.wav' }
     ] },
    { key: 'appointment',  description: 'RDV', one: true, urls: [
      { type: 0, url: '/assets/audio_sentences/appointment_sentence_p1.wav' },
      { type: 0, url: '/assets/audio_sentences/appointment_sentence_p2.wav' },
     ] }

  ];

  ngOnInit() {
  }

  getDateSentence() {
    return `Bonjour ${name}, nous sommes le ` + 
    (new Date()).toLocaleString(this.locale, { day: "numeric", month:"long", year: "numeric" }) + 
    ", il est " + (new Date()).toLocaleString(this.locale, { hour: "numeric", minute: "numeric" }).replace(":", " heure ");
  }

  getHour() {
    return (new Date()).toLocaleString(this.locale, { hour: "numeric", minute: "numeric" }).replace(":", " heure ");
  }

  getDate() {
    return (new Date()).toLocaleString(this.locale, { day: "numeric", month:"long", year: "numeric" });
  }

  playSynthese(event) {
    const msg = new SpeechSynthesisUtterance(event.url);
    msg.lang = 'fr-FR';
    msg.rate = 0.7;
    (<any>window).speechSynthesis.speak(msg);
  }

 playAsync(url) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.preload = "auto";
      audio.autoplay = true;
      audio.onerror = reject;
      audio.onended = resolve;
      audio.src = url
    });
  }
  
  playAsyncSynth(url) {
    return new Promise((resolve, reject) => {
      const msg = new SpeechSynthesisUtterance(url);
      msg.lang = 'fr-BE';
      msg.pitch = 1.5;
      msg.onerror = reject;
      msg.onend = resolve;
      (<any>window).speechSynthesis.speak(msg)
    });
  }
 
  async play(event) {
    const audio = new Audio();
    const elem =this.sounds.find(e => e.key === event.key);
    if (elem === undefined) return;
    if (elem.one === true) {
      if (elem.key === 'wakeup') this.playAsync(elem.urls[0].url)
        .then(() => this.playAsyncSynth(this.getHour()))
        .then(() => this.playAsync(elem.urls[1].url))
        .then(() => this.playAsyncSynth(this.getDate()))
        .then(() => this.playAsync(elem.urls[2].url))
      if (elem.key === 'appointment') this.playAsync(elem.urls[0].url)
        .then(() => this.playAsyncSynth(this.getHour()))
        .then(() => this.playAsync(elem.urls[1].url))
    } else {
      audio.src = event.url; 
      audio.load();
      await audio.play();
    }
  }
}
