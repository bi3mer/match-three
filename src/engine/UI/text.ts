
export function drawStrokedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  font: string,
  fillColor: string,
  strokeColor: string) {

  ctx.font = font;
  ctx.fillStyle = fillColor;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 8;
  ctx.lineJoin = "round";
  ctx.miterLimit = 2;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}
