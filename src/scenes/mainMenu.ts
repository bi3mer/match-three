import { IMAGE_WIDTH, SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants";
import { Scene } from "../engine/scene";
import { drawStrokedText } from "../engine/util";
import { AssetsManager } from "../engine/assetManager";

export class MainMenu extends Scene {
  public update(deltaTime: number): number {
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
      "White",
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
