import { randomInt } from "./util";

export class SoundManager {
  private static sounds: HTMLAudioElement[] = []

  public static init(): void {
    this.sounds.push(new Audio("assets/success_1.wav"));
    this.sounds.push(new Audio("assets/success_2.wav"));
    this.sounds.push(new Audio("assets/success_3.wav"));
    this.sounds.push(new Audio("assets/success_4.wav"));
    this.sounds.push(new Audio("assets/explosion.wav"));
  }

  public static isLoaded(): boolean {
    for (let i = 0; i < this.sounds.length; ++i) {
      if (!this.sounds[i].readyState) {
        return false;
      }
    }

    return true;
  }

  public static playMatchSound(): void {
    const index = randomInt(0, 3);
    this.sounds[index].currentTime = 0;
    this.sounds[index].play();
  }

  public static playExplosion(): void {
    this.sounds[4].currentTime = 0;
    this.sounds[4].play();
  }
}
