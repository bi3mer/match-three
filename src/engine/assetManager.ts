import { IMAGE_HEIGHT, IMAGE_WIDTH, MATCH_TYPES } from "./constants";

export class AssetsManager {
  public static images: HTMLImageElement[] = []
  private static sounds: [HTMLAudioElement, number][] = []

  public static loadImage(path: string, width: number | null, height: number | null): number {
    let image = new Image();
    image.src = `assets/${path}`;

    if (width !== null) {
      image.width = Number(width);
    }

    if (height !== null) {
      image.height = Number(height);
    }

    this.images.push(image);
    return this.images.length - 1;
  }

  public static loadSound(path: string, startTime: number): number {
    this.sounds.push([
      new Audio(`assets/${path}`),
      Math.max(startTime, 0),
    ]);

    return this.sounds.length - 1;
  }

  public static percentLoaded(): number {
    let loaded = 0;
    let i: number;
    for (i = 0; i < this.images.length; ++i) {
      loaded += Number(this.images[i].complete);
    }

    for (i = 0; i < this.sounds.length; ++i) {
      loaded += Number(this.sounds[i][0].readyState);
    }

    return loaded / (this.images.length + this.sounds.length);
  }

  public static playSound(index: number) {
    if (index < this.sounds.length && index >= 0) {
      const [sound, startTime] = this.sounds[index];
      sound.currentTime = startTime;
      sound.play();
    } else {
      console.error(`Sound index ${index} out of bounds for ${this.sounds.length} sounds loaded.`);
    }
  }
}
