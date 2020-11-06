import Camera from './Camera.js'
import Game from './Game.js'
import Renderer from './Renderer.js'
import Point3D from './Point3D.js'

export default abstract class AbstractRenderer implements Renderer {
  protected constructor(
    public readonly camera: Camera,
  ) {
  }

  public render(game: Game, deltaTime: number): void {
    for (const gameObject of game.gameObjects) {
      gameObject.render(this, deltaTime)
    }
  }

  public abstract drawPolygon(
    color: string,
    ...points: readonly [Readonly<Point3D>, Readonly<Point3D>, Readonly<Point3D>, ...ReadonlyArray<Readonly<Point3D>>]
  ): void
}
