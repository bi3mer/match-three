import { Assets } from "../assets";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants";
import { drawStrokedText } from "../util";
import { Scene } from "./scene";

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
      Assets.matchTypes[1],
      (SCREEN_WIDTH - width) / 5,
      600,
      width,
      width
    );

    ctx.drawImage(
      Assets.matchTypes[0],
      (SCREEN_WIDTH - Assets.matchTypes[0].width) / 2,
      550
    );
  }
}
