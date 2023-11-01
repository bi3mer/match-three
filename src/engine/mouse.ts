export class Mouse {
  public static mouseDown: boolean
  public static x: number
  public static y: number

  public static downX: number
  public static downY: number
  public static upX: number
  public static upY: number
  public static shouldHandleMouseEvent: boolean

  public static init(canvas: HTMLCanvasElement) {
    this.x = 0;
    this.y = 0;
    this.downX = 0;
    this.downY = 0;
    this.upX = 0;
    this.upY = 0;
    this.mouseDown = false;

    this.shouldHandleMouseEvent = false;

    canvas.addEventListener('mousemove', (e: MouseEvent) => {
      this.x = e.x - canvas.offsetLeft;
      this.y = e.y - canvas.offsetTop;
    });

    canvas.addEventListener('mousedown', (e: MouseEvent) => {
      this.downX = e.x - canvas.offsetLeft;
      this.downY = e.y - canvas.offsetTop;
      // this.downX = Math.floor((e.x - canvas.offsetLeft) / IMAGE_WIDTH);
      // this.downY = Math.floor((e.y - canvas.offsetTop) / IMAGE_HEIGHT) - 1;
      // this.mouseDown = true;
    });

    canvas.addEventListener('mouseup', (e: MouseEvent) => {
      this.upX = e.x - canvas.offsetLeft;
      this.upY = e.y - canvas.offsetTop;
      // this.upX = Math.floor((e.x - canvas.offsetLeft) / IMAGE_WIDTH);
      // this.upY = Math.floor((e.y - canvas.offsetTop) / IMAGE_HEIGHT) - 1;
      this.shouldHandleMouseEvent = true;
      this.mouseDown = false;
    });
  }
}
