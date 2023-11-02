import { EXPLOSION_TIME, SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants"; // @TODO: shouldn't use constants here
import { randomFloat, randomInt, randomSign } from "./util";

export class Explosion {
  particles: [number, number][]
  acceleration: [number, number][]
  elapsed: number

  constructor(numParticles: number) {
    this.elapsed = 0;

    this.particles = [];
    this.acceleration = [];

    for (let i = 0; i < numParticles; ++i) {
      this.particles.push([0, 0]);
      this.acceleration.push([0, 0])
    }
  }

  public reset(): void {
    this.elapsed = 0;
    const size = this.particles.length;

    for (let i = 0; i < size; ++i) {
      this.particles[i][0] = SCREEN_WIDTH / 2;
      this.particles[i][1] = SCREEN_HEIGHT / 2;

      this.acceleration[i][0] = randomFloat(0.1, 10.0) * randomSign();
      this.acceleration[i][1] = randomFloat(0.1, 10.0) * randomSign();
    }
  }

  // Return true if explosion is finished
  public update(deltaTime: number): boolean {
    const size = this.particles.length;
    for (let i = 0; i < size; ++i) {
      this.particles[i][0] += this.acceleration[i][0];
      this.particles[i][1] += this.acceleration[i][1];
    }

    this.elapsed += deltaTime;
    return this.elapsed > EXPLOSION_TIME;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    const size = this.particles.length;
    ctx.fillStyle = 'white';

    for (let i = 0; i < size; ++i) {
      ctx.beginPath()
      ctx.arc(this.particles[i][0], this.particles[i][1], 10, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}
