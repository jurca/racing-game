import Camera from './Camera.js'
import Game from './Game.js'
import Point3D from './Point3D.js'

export interface IRenderer<C extends Camera> {
  readonly camera: C

  render(game: Game<C, this>, deltaTime: number): void

  drawPolygon(
    color: string,
    ...points: readonly [Readonly<Point3D>, Readonly<Point3D>, Readonly<Point3D>, ...ReadonlyArray<Readonly<Point3D>>]
  ): void
}

export default abstract class Renderer<C extends Camera> implements IRenderer<C> {
  protected constructor(
    public readonly camera: C,
  ) {
  }

  public render(game: Game<C, Renderer<C>>, deltaTime: number): void {
    for (const gameObject of game.gameObjects) {
      gameObject.render(this, deltaTime)
    }
  }

  public abstract drawPolygon(
    color: string,
    ...points: readonly [Readonly<Point3D>, Readonly<Point3D>, Readonly<Point3D>, ...ReadonlyArray<Readonly<Point3D>>]
  ): void
}
