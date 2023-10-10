import { IMAGE_HEIGHT, IMAGE_WIDTH } from "./constants";

export class Assets {
  static images: HTMLImageElement[]
  static size: number
  
  static init(): void {
    const types = [
      "apple",
      "bread",
      "coconut",
      "green-thing",
      "milk",
      "orange",
      "star"
    ];

    this.images = [];
    this.size = types.length;
    
    for(let i = 0; i < this.size; ++i) {
      this.images.push(new Image());
      this.images[i].src = `assets/${types[i]}.png`;
      this.images[i].width = IMAGE_WIDTH;
      this.images[i].height = IMAGE_HEIGHT;
    }
  }
}
