import { IMAGE_HEIGHT, IMAGE_WIDTH } from "./constants";

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

  static percentLoaded(): number {
    let loaded = 0;
    for (let i = 0; i < this.size; ++i) {
      loaded += Number(this.matchTypes[i].complete);
    }

    loaded += Number(this.backGround.complete);

    return loaded / (this.size + 1);
  }
}
