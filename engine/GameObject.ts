import Game from './Game.js'
import Point3D from './Point3D.js'
import Renderer from './Renderer.js'

export default interface GameObject {
  readonly parent: null | GameObject
  readonly subObjects: readonly GameObject[]
  readonly position: Point3D
  readonly absolutePosition: Readonly<Point3D>

  onRun(): void

  update(game: Game, deltaTime: number): void

  onStop(): void

  render(renderer: Renderer, deltaTime: number): void

  addSubObject(gameObject: GameObject): void

  removeSubObject(gameObject: GameObject): void
}
