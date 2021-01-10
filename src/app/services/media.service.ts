import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  SOUNDS_BASE_PATH = '../../../assets/sounds';
  constructor() { }

  /**
   * Play audio file
   * @param source, path of the file to read
   */
  playSound(source: string): void {
    const audio = new Audio();
    audio.src = `${this.SOUNDS_BASE_PATH}/${source}.mp3`;
    audio.load();
    audio.play();
  }
}
