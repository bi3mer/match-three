export abstract class Scene {
  public canvas: HTMLCanvasElement | null = null;

  // Return -1 to not change the scene. Return anythign else to change the scene
  // to the target scene.
  abstract update(deltaTime: number): number;
  abstract render(ctx: CanvasRenderingContext2D): void;
}
