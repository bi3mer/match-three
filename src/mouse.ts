import { IMAGE_HEIGHT, IMAGE_WIDTH } from "./constants"

export class Mouse {
  downX: number
  downY: number

  upX: number
  upY: number

  shouldHandleMouseEvent: boolean

  constructor(canvas: HTMLCanvasElement) {
    const offsetLeft = canvas.offsetLeft;
    const offsetTop = canvas.offsetTop;

    this.downX = 0;
    this.downY = 0;
    this.upX = 0;
    this.upY = 0;

    this.shouldHandleMouseEvent = false;

    canvas.addEventListener('mousedown', (e: MouseEvent) => {
      this.downX = Math.floor((e.x - offsetLeft) / IMAGE_WIDTH);
      this.downY = Math.floor((e.y - offsetTop) / IMAGE_HEIGHT) - 1;
    });

    canvas.addEventListener('mouseup', (e: MouseEvent) => {
      this.upX = Math.floor((e.x - offsetLeft) / IMAGE_WIDTH);
      this.upY = Math.floor((e.y - offsetTop) / IMAGE_HEIGHT) - 1;
      this.shouldHandleMouseEvent = true;
    });
  }
}