import Camera from './Camera.js'
import Game from './Game.js'
import Point3D from './Point3D.js'

export default interface Renderer {
  readonly camera: Camera

  render(game: Game, deltaTime: number): void

  drawPolygon(
    color: string,
    ...points: readonly [Readonly<Point3D>, Readonly<Point3D>, Readonly<Point3D>, ...ReadonlyArray<Readonly<Point3D>>]
  ): void
}
