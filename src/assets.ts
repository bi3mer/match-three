import { IMAGE_HEIGHT, IMAGE_WIDTH, MATCH_TYPES } from "./constants";

export class Assets {
  static matchTypes: HTMLImageElement[]
  static backGround: HTMLImageElement
  
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
    
    for(let i = 0; i < MATCH_TYPES; ++i) {
      this.matchTypes.push(new Image());
      this.matchTypes[i].src = `assets/${types[i]}.png`;
      this.matchTypes[i].width = Number(IMAGE_WIDTH);
      this.matchTypes[i].height = Number(IMAGE_HEIGHT);
    }

    this.backGround = new Image();
    this.backGround.src = 'assets/bg.png';
  }

  static percentLoaded(): number {
    let loaded = 0;
    for (let i = 0; i < MATCH_TYPES; ++i) {
      loaded += Number(this.matchTypes[i].complete);
    }

    loaded += Number(this.backGround.complete);

    return loaded / (MATCH_TYPES + 1);
  }
}
