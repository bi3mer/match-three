import { IMAGE_HEIGHT, IMAGE_WIDTH } from "./constants";

// TODO: Loading right now assumes fast internet. Need to have an isLoaded
// function and use it before the game is started.
export class Assets {
  static matchTypes: HTMLImageElement[]
  static backGround: HTMLImageElement
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

    this.matchTypes = [];
    this.size = types.length;
    
    for(let i = 0; i < this.size; ++i) {
      this.matchTypes.push(new Image());
      this.matchTypes[i].src = `assets/${types[i]}.png`;
      this.matchTypes[i].width = IMAGE_WIDTH;
      this.matchTypes[i].height = IMAGE_HEIGHT;
    }

    this.backGround = new Image();
    this.backGround.src = 'assets/bg.png';
  }
}
