import { IMAGE_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants";
import { Scene } from "../engine/scene";
import { drawStrokedText } from "../engine/UI/text";
import { AssetsManager } from "../engine/assetManager";
import { Mouse } from "../engine/mouse";

export class MainMenu extends Scene {
  private playButtonX: number;
  private playButtonY: number;
  private playButtonWidth: number;
  private playButtonHeight: number;
  private playButtonColor: string;
  private playButtonRegularColor: string;
  private playButtonHighlightColor: string;

  constructor() {
    super();

    this.playButtonX = SCREEN_WIDTH / 2 - 76;
    this.playButtonY = SCREEN_HEIGHT / 2;
    this.playButtonWidth = 150;
    this.playButtonHeight = 90;

    this.playButtonRegularColor = '#FCD534';
    this.playButtonHighlightColor = 'White';
    this.playButtonColor = this.playButtonRegularColor;
  }

  public update(_deltaTime: number): number {
    if (Mouse.x >= this.playButtonX && Mouse.x <= this.playButtonX + this.playButtonWidth && Mouse.y <= this.playButtonY + 15 && Mouse.y >= this.playButtonY - this.playButtonHeight) {
      this.playButtonColor = this.playButtonHighlightColor;

      if (Mouse.mouseDown) {
        return 1; // scene index for game scene
      }
    } else {
      this.playButtonColor = this.playButtonRegularColor;
    }

    return -1;
  }


  public render(ctx: CanvasRenderingContext2D): void {
    drawStrokedText(
      ctx,
      "Match 3",
      10,
      150,
      "150px Monaco",
      "#FCD534",
      "White"
    );

    drawStrokedText(
      ctx,
      "Play",
      SCREEN_WIDTH / 2 - 76,
      SCREEN_HEIGHT / 2,
      "60px Monaco",
      this.playButtonColor,
      "Black"
    );

    const width = 200;
    ctx.drawImage(
      AssetsManager.images[1],
      (SCREEN_WIDTH - width) / 5,
      600,
      width,
      width
    );

    ctx.drawImage(
      AssetsManager.images[0],
      (SCREEN_WIDTH - IMAGE_WIDTH) / 2,
      550
    );
  }
}
